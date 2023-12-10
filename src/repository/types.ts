export type RoomData = {
  createdAt: object;
  roomName: string;
};

export type Round = {
  title: string;
  state: "init" | "playing" | "results" | "finished";
  deck: string[];
  createdBy?: string;
  answers?: {
    uid: string;
    displayName: string;
    answer: string | null;
  }[];
};

export type PlayerStatus = {
  displayName: string;
  isWatcher: boolean;
  [key: string]: string | boolean;
};
