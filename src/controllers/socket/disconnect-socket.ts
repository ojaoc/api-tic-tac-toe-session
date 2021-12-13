import { EventHandlerArgs } from "src/ts/socket-interfaces";

export const disconnectSocketController =
  ({ io, socket, rooms }: EventHandlerArgs) =>
  () => {
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
  };
