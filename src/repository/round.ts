import {
  ref,
  push,
  query,
  limitToLast,
  get,
  update,
  child,
} from "firebase/database";
import { db } from "../lib/firebase";
import { Round } from "./types";

export const roundsRef = (roomId: string) => ref(db, `rounds/${roomId}`);

export const roundRef = (roomId: string, roundId: string) =>
  ref(db, `rounds/${roomId}/${roundId}`);

export const createBlankRound = (roomId: string, roundData: Round) =>
  push(roundsRef(roomId), roundData);

export const getCurrentRound = async (
  roomId: string
): Promise<Record<string, Round>> => {
  const data = await get(query(roundsRef(roomId), limitToLast(1)));
  return data.val();
};

export const updateRound = async (
  roomId: string,
  roundId: string,
  values: Partial<Round>
) => {
  await update(child(roundsRef(roomId), roundId), values);
  return values;
};
