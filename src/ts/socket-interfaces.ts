import { Server, Socket } from "socket.io";

export interface RoomResponse {
  id: string;
  isFull: boolean;
}

export interface EventHandlerArgs {
  io: Server;
  socket: Socket;
  rooms: Map<string, Set<string>>;
}
