import { useEffect, useState } from "react";
import { useRoomPlayers } from "../hooks/useRoomPlayers";
import { ImEye } from "react-icons/im";
import { Round } from "../repository/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRound } from "../repository/round";
import { updatePlayerAction } from "../service/roomPlayers";

type PokerTableProps = {
  roomId: string;
  userId: string;
  roundId: string;
  state: Round["state"];
  isHost: boolean;
};

const PokerTable = ({
  roomId,
  userId,
  state,
  roundId,
  isHost,
}: PokerTableProps) => {
  const [show, setShow] = useState(false);
  const { onlineUsers } = useRoomPlayers();
  const answerKey = `answer-${roundId}`;

  const client = useQueryClient();

  const { mutate: updateRoundInfo } = useMutation({
    mutationFn: (values: object) => updateRound(roomId, roundId, values),
    onSuccess: () => {
      updatePlayerAction(roomId, userId, "revealed round");
      client.invalidateQueries({ queryKey: ["round", roomId] });
    },
  });

  useEffect(() => {
    if (state == "results") setShow(true);
    else setShow(false);
  }, [state]);

  const isReadyToShow =
    state === "playing" &&
    onlineUsers?.filter(({ isWatcher }) => !isWatcher).length ===
      onlineUsers?.filter((player) => player[answerKey]).length;

  return (
    <section className="flex flex-wrap justify-center grow gap-6 px-5 relative">
      {isReadyToShow && isHost && (
        <div className="absolute w-full h-full flex">
          <button
            className="m-auto p-5 px-8 rounded-full text-5xl font-mono bg-sky-500 text-white hover:bg-sky-400 transform duration-100"
            onClick={() =>
              updateRoundInfo({
                state: "results",
                answers: onlineUsers?.map((user) => ({
                  uid: user.uid,
                  displayName: user.displayName,
                  answer: user[answerKey] ?? null,
                })),
              })
            }
          >
            Reveal Cards
          </button>
        </div>
      )}
      {onlineUsers?.map((player) => (
        <div
          key={player.uid}
          className="h-1/3 flex flex-col gap-3 perspective-800"
        >
          <div
            className={`mx-auto h-36 w-28 rounded-xl flex gap-2 mt-auto transform duration-300 border-4 ${
              show || player.uid === userId
                ? "rotate-y-0"
                : player.isWatcher
                ? "bg-gray-100 border-gray-100 rotate-y-180 "
                : "border-blue-300 rotate-y-180 "
            } ${
              !show && player[answerKey] ? "bg-blue-300 border-blue-300" : ""
            }`}
          >
            <div className="m-auto text-3xl text-center">
              {player.isWatcher ? (
                <ImEye className="text-4xl text-gray-200" />
              ) : show ? (
                player[answerKey]
              ) : (
                player.uid === userId && player[answerKey]
              )}
            </div>
          </div>
          <span className="mx-auto mb-auto font-semibold text-lg">
            {player.displayName}
          </span>
        </div>
      ))}
    </section>
  );
};

export default PokerTable;
