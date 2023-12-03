import { ref, query } from "firebase/database";
import { db } from "../lib/firebase";

export const roomsRef = ref(db, "rooms");

export const getAllRooms = () => query(roomsRef).toJSON();
