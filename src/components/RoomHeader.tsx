import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CiEdit } from "react-icons/ci";
import { Round } from "../repository/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRound } from "../repository/round";
import DeckEditor from "./DeckEditor";

type RoomHeaderProps = {
  roundInfo: Round;
  roundId: string;
  roomId: string;
};

const RoomHeader = ({ roundInfo, roundId, roomId }: RoomHeaderProps) => {
  const { user } = useContext(AuthContext);
  const { title, state } = roundInfo;
  const [txtTitle, setTxtTitle] = useState(roundInfo.title);

  const client = useQueryClient();

  const { mutate: updateRoundInfo } = useMutation({
    mutationFn: (values: object) => updateRound(roomId, roundId, values),
    onSuccess: () => client.invalidateQueries({ queryKey: ["round", roomId] }),
  });

  if (user?.isAnonymous)
    return (
      <div className="flex gap-2 mt-5 w-full flex-col max-w-7xl">
        <h2 className="text-4xl py-3 px-1 focus:outline-gray-300 rounded-md text-gray-800 grow">
          {state === "init" && !title
            ? "Please wait for the host to prepare the next round.."
            : title}
        </h2>
        <h4 className="font-semibold text-lg">Cards</h4>
        <div className="flex gap-3">
          {roundInfo?.deck.map((card) => (
            <span
              key={card}
              className="text-3xl my-auto flex gap-1.5 rounded-md py-1.5 px-3 hover:bg-cyan-200 flex-col border-2 border-cyan-200 min-w-[60px] transform duration-75 text-center h-20"
            >
              <span className="mt-auto mb-2">{card}</span>
            </span>
          ))}
        </div>
      </div>
    );

  const disabled = ["playing", "results", "finished"].includes(roundInfo.state);

  return (
    <div className="flex flex-col gap-2 mt-5 w-full items-center max-w-7xl m-auto">
      <div className="flex w-full">
        <input
          type="text"
          title="vote-title"
          placeholder="What are we voting now ?"
          className="text-4xl py-3 px-1 focus:outline-gray-300 rounded-md text-gray-800 grow disabled:cursor-not-allowed"
          value={txtTitle}
          onChange={({ target }) => setTxtTitle(target.value)}
          disabled={disabled}
        />
        <button
          title="edit"
          className="text-3xl pt-2 text-gray-900 disabled:cursor-not-allowed"
          onClick={() => updateRoundInfo({ title: txtTitle })}
          disabled={disabled}
        >
          <CiEdit />
        </button>
      </div>
      <DeckEditor
        currentDeck={roundInfo.deck ?? []}
        onConfirm={(deck) => updateRoundInfo({ deck })}
        disabled={disabled}
      />
      <button
        className="w-full p-3 text-white bg-cyan-700 mt-3 text-lg font-semibold tracking-wider disabled: cursor-not-allowed disabled:bg-gray-300"
        onClick={() => updateRoundInfo({ state: "playing" })}
        disabled={disabled}
      >
        {state === "init" && "Start Poker !"}
        {state === "playing" && "Playing..."}
      </button>
    </div>
  );
};

export default RoomHeader;
