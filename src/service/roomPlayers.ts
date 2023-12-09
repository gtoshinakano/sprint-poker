import { update } from "firebase/database";
import { playerStatusRef } from "../repository/status";

export const togglePlayerWatcherState = (
  roomId: string,
  userId: string,
  currentState: boolean
) => update(playerStatusRef(roomId, userId), { isWatcher: !currentState });
