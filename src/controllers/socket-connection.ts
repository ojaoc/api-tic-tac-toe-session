import { Socket, Server } from "socket.io";
import { EventHandlerArgs } from "src/ts/socket-interfaces";
import { disconnectSocketController } from "./socket/disconnect-socket";
import { joinRoomController } from "./socket/join-room";
import { listRoomsController } from "./socket/list-rooms";

export const socketConnectionController = (io: Server) => (socket: Socket) => {
  socket.leave(socket.id); // Remove socket from default room
  const rooms = io.sockets.adapter.rooms;

  const handlerArgs: EventHandlerArgs = { io, socket, rooms };

  socket.on("room:join", joinRoomController(handlerArgs));

  socket.on("room:list", listRoomsController(handlerArgs));

  socket.on("disconnecting", disconnectSocketController(handlerArgs));
};
