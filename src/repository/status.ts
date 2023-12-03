import { getDatabase, ref } from "firebase/database";
import { db } from "../lib/firebase";

export const connectedRef = ref(getDatabase(), ".info/connected");

export const statusRef = (roomId: string, userId: string) =>
  ref(db, `status/${roomId}/${userId}`);
