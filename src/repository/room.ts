import { ref, query, get, set, serverTimestamp } from "firebase/database";
import { db } from "../lib/firebase";
import { RoomData } from "./types";

export const roomsRef = ref(db, "rooms");

export const roomRef = (roomId: string) => ref(db, `rooms/${roomId}`);

export const getAllRooms = async (): Promise<Record<string, RoomData>> => {
  const data = await get(query(roomsRef));
  return data.val();
};

export const getRoom = (roomId: string) => get(roomRef(roomId));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRoom = (roomId: string, data?: any) =>
  set(roomRef(roomId), { ...data, createdAt: serverTimestamp() }); // TODO create a type for it
