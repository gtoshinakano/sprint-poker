import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { PlayerStatus } from "../repository/types";

interface RoomPlayersStore {
  roomId: string | null;
  onlineUsers?: (PlayerStatus & { uid: string })[];
  setOnlineUsers: (snapshot: Record<string, PlayerStatus>) => void;
}

export const useRoomPlayers = create<RoomPlayersStore>()(
  devtools((set) => ({
    roomId: null,
    setOnlineUsers: (usersSnap) =>
      set((state) => ({
        ...state,
        onlineUsers: Object.entries(usersSnap).map(([uid, value]) => ({
          uid,
          ...value,
        })),
      })),
  }))
);
