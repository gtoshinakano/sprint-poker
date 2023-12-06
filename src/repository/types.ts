export type RoomData = {
  createdAt: object;
  roomName: string;
};

export type Round = {
  title: string;
  state: "init" | "playing" | "results" | "finished";
  deck: string[] | number[];
  createdBy?: string;
};
