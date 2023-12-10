import { Round } from "../repository/types";
import { RiRestartFill, RiPlayCircleFill } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlankRound, updateRound } from "../repository/round";
import { updatePlayerAction } from "../service/roomPlayers";

type ResultsFooterProps = {
  deck: string[];
  roundInfo: Round;
  readOnly: boolean;
  roomId: string;
  roundId: string;
  userId: string;
};

const ResultsFooter = ({
  deck,
  roundInfo,
  readOnly,
  roomId,
  roundId,
  userId,
}: ResultsFooterProps) => {
  const { answers } = roundInfo;

  const client = useQueryClient();

  const { mutate: updateRoundInfo } = useMutation({
    mutationFn: (values: object) => updateRound(roomId, roundId, values),
    onSuccess: (data) => {
      updatePlayerAction(
        roomId,
        userId,
        data?.state === "playing" ? "re-start round" : "started new round"
      );
      client.invalidateQueries({ queryKey: ["round", roomId] });
    },
  });

  const createNewRound = () => {
    updateRoundInfo({ state: "finished" });
    createBlankRound(roomId, {
      title: "",
      state: "init",
      deck: ["1", "2", "3", "5", "8", "13"],
    });
  };

  const isAvgResults = deck.every((card) => !Number.isNaN(parseInt(card)));

  return (
    <footer className="flex gap-4 m-auto">
      {isAvgResults ? (
        <AvgResults answers={answers} />
      ) : (
        <CountResults answers={answers} />
      )}
      {!readOnly && (
        <div className="flex flex-col gap-1">
          <button
            className="px-4 py-3 my-auto flex text-xl bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white"
            onClick={createNewRound}
          >
            <span className="grow text-left">Start New</span>
            <RiPlayCircleFill className="my-auto ml-3" />
          </button>
          <button
            className="px-4 py-3 my-auto flex text-xl bg-cyan-400 hover:bg-cyan-300 rounded-lg text-white"
            onClick={() => updateRoundInfo({ state: "playing", answers: null })}
          >
            <span className="grow text-left">Restart</span>
            <RiRestartFill className="my-auto ml-3" />
          </button>
        </div>
      )}
    </footer>
  );
};

export default ResultsFooter;

const AvgResults = ({ answers }: { answers: Round["answers"] }) => {
  const cardInfo = answers?.reduce(
    (acc, cur) => {
      if (cur.answer === null) return acc;
      acc.total += parseInt(cur.answer);
      acc.count += 1;

      return acc;
    },
    { total: 0, count: 0 }
  );

  return (
    <div className="flex gap-4">
      {cardInfo && (
        <div
          className={`
          text-5xl h-36 w-28 border-4 rounded-lg border-blue-300 flex flex-col items-center justify-evenly text-gray-700 transform duration-100 hover:bg-sky-100 text-center
        `}
        >
          <b>{(cardInfo?.total / cardInfo?.count).toFixed(2)}</b>
          <small className="text-base">Total: {cardInfo.total}</small>
          <small className="text-base">Count: {cardInfo.count}</small>
        </div>
      )}
    </div>
  );
};

const CountResults = ({ answers }: { answers: Round["answers"] }) => {
  const cards = answers?.reduce((acc, cur) => {
    if (cur.answer === null) return acc;
    if (!acc[cur.answer]) {
      acc[cur.answer] = { count: 1 };
    } else {
      acc[cur.answer].count += 1;
    }

    return acc;
  }, {} as Record<string, { count: number }>);

  return (
    <div className="flex gap-4">
      {cards &&
        Object.entries(cards).map(([key, value]) => (
          <div
            key={key}
            className={`text-4xl h-36 w-28 border-4 rounded-lg border-blue-300 flex flex-col items-center justify-around text-center text-gray-700 transform duration-100 hover:bg-sky-100`}
          >
            <b>{key}</b>
            <small className="text-base">Count: {value.count}</small>
          </div>
        ))}
    </div>
  );
};
