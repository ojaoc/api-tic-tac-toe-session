import { RoomResponse } from "src/ts/socket-interfaces";
import { EventHandlerArgs } from "src/ts/socket-interfaces";

export const listRoomsController =
  ({ rooms }: EventHandlerArgs) =>
  (callback: (roomList: RoomResponse[]) => void) => {
    callback(
      [...rooms].map(([room, players]) => ({
        id: room,
        isFull: players.size >= 2,
      }))
    );
  };
