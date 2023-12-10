import { set } from "firebase/database";
import { roomRef } from "../repository/room";
import { roundsRef } from "../repository/round";
import { roomStatusRef } from "../repository/status";

export const deleteRoom = (roomId: string) => {
  set(roomRef(roomId), null);
  set(roundsRef(roomId), null);
  set(roomStatusRef(roomId), null);
};
