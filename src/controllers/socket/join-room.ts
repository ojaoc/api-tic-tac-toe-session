import { EventHandlerArgs, RoomResponse } from "src/ts/socket-interfaces";
import { v4 as uuidv4 } from "uuid";

export const joinRoomController =
    ({ io, socket, rooms }: EventHandlerArgs) =>
    (roomId: string, cb: (arg0: RoomResponse) => void): void => {
        if (!roomId) {
            socket.join(uuidv4());
            const [createdSocketRoomId] = socket.rooms;
            const roomObj: RoomResponse = {
                id: createdSocketRoomId,
                isFull: rooms.get(createdSocketRoomId).size >= 2,
            };
            cb(roomObj);
            io.emit("room:created", roomObj);
        } else {
            if (!rooms.get(roomId)) {
                socket.emit("message", "Room not found.");
                socket.disconnect(true);
                return;
            } else if (rooms.get(roomId)?.size >= 2) {
                socket.emit("message", "Room already full.");
                socket.disconnect(true);
                return;
            } else {
                socket.join(roomId);
                const roomObj: RoomResponse = {
                    id: roomId,
                    isFull: rooms.get(roomId).size >= 2,
                };
                cb(roomObj);
                io.emit("room:updated", roomObj);
            }
        }
    };
