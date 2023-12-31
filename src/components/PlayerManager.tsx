import { ImEye } from "react-icons/im";
import { GiCardAceClubs, GiCardPlay } from "react-icons/gi";
import { useEffect } from "react";
import { onValue } from "firebase/database";
import { roomStatusRef } from "../repository/status";
import { useRoomPlayers } from "../hooks/useRoomPlayers";
import { togglePlayerWatcherState } from "../service/roomPlayers";

type PlayerManagerProps = {
  readOnly?: boolean;
  userId: string | null;
  roomId: string;
  roundId: string;
  refetchRound: () => void;
};

const PlayerManager = ({
  readOnly,
  userId,
  roomId,
  roundId,
  refetchRound,
}: PlayerManagerProps) => {
  const { setOnlineUsers, onlineUsers } = useRoomPlayers();
  useEffect(() => {
    onValue(roomStatusRef(roomId), (snapshot) => {
      if (snapshot.val()) {
        setOnlineUsers(snapshot.val());
        refetchRound();
      }
    });
  }, []);

  return (
    <aside className="fixed right-2 top-1/2 -translate-y-1/2  h-[90vh] w-72 flex flex-col gap-1.5">
      <div className="flex bg-rose-100 p-1.5 font-semibold text-gray-700 rounded-md">
        <div className="my-auto p-1.5 grow">Online Players</div>
      </div>
      {onlineUsers?.map(({ uid, displayName, isWatcher, ...player }) => (
        <div key={uid} className="flex px-1 font-light text-gray-700">
          <div className="my-auto px-2 grow flex">
            {!isWatcher && player[`answer-${roundId}`] && (
              <GiCardPlay className="mr-3 text-blue-500 my-auto" />
            )}
            {displayName}
          </div>
          <button
            className={`my-auto py-2 px-2 text-xl hover:bg-gray-100 disabled:bg-white rounded-lg transform duration-75
            ${isWatcher ? "text-gray-300" : "text-green-300"}`}
            title={displayName}
            disabled={readOnly && userId !== uid}
            onClick={() =>
              togglePlayerWatcherState(roomId, uid, isWatcher, roundId)
            }
          >
            {isWatcher ? <ImEye /> : <GiCardAceClubs />}
          </button>
        </div>
      ))}
    </aside>
  );
};

export default PlayerManager;
