import { Socket, Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export const socketConnectionController = (io: Server) => (socket: Socket) => {
    socket.leave(socket.id); // Remove socket from default room
    const roomId = socket.handshake.query.roomId as string;
    const rooms = io.sockets.adapter.rooms;
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

    const [assignedSocketRoom] = socket.rooms;
    socket.emit("message", { assignedSocketRoom });

    socket.on("message", (message) => {
        const [roomOfSocket] = socket.rooms;
        io.to(roomOfSocket).emit("message", message);
    });

    socket.on("room:list", (callback) => {
        callback([...rooms].map(([room, players]) => ({ id: room, isFull: players.size >= 2 })));
    });

    socket.on("disconnecting", () => {
        const [roomOfSocket] = socket.rooms;
        const copySet = new Set(rooms.get(roomOfSocket));

        copySet.delete(socket.id);

        if (copySet.size > 0) {
            io.emit("room:updated", {
                id: roomOfSocket,
                isFull: copySet.size >= 2,
            });
        } else {
            io.emit("room:deleted", roomOfSocket);
        }
    });
};
