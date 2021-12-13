import { EventHandlerArgs } from "src/ts/socket-interfaces";
import { v4 as uuidv4 } from "uuid";

export const joinRoomController =
  ({ io, socket, rooms }: EventHandlerArgs) =>
  (roomId: string): void => {
    if (!roomId) {
      socket.join(uuidv4());
      const [createdSocketRoomId] = socket.rooms;
      io.emit("room:created", {
        id: createdSocketRoomId,
        isFull: rooms.get(createdSocketRoomId).size >= 2,
      });
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
        io.emit("room:updated", {
          id: roomId,
          isFull: rooms.get(roomId).size >= 2,
        });
      }
    }
  };
