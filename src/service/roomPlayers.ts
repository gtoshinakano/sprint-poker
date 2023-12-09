import { update } from "firebase/database";
import { playerStatusRef } from "../repository/status";

export const togglePlayerWatcherState = (
  roomId: string,
  userId: string,
  currentState: boolean,
  roundId: string
) =>
  update(playerStatusRef(roomId, userId), {
    isWatcher: !currentState,
    ...(!currentState ? { [`answer-${roundId}`]: null } : undefined),
  });

export const playCard = (
  roomId: string,
  userId: string,
  answer: Record<string, string | null>
) => update(playerStatusRef(roomId, userId), answer);
