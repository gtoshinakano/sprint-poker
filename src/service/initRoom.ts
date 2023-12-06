import { createRoom } from "../repository/room";
import { createBlankRound } from "../repository/round";

export function initRoom(roomName: string) {
  const roomId = encodeURIComponent(roomName.split(" ").join("-"));
  return Promise.all([
    createRoom(roomId, { roomName: roomId }),
    createBlankRound(roomId, {
      title: "",
      state: "init",
      deck: ["1", "2", "3", "5", "8", "13"],
    }),
  ]);
}
