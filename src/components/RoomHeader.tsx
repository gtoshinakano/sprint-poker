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
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["round", roomId, "currentRound"] }),
  });

  if (user?.isAnonymous)
    return (
      <div className="flex gap-2 mt-5 w-full">
        <h2 className="text-4xl py-3 px-1 focus:outline-gray-300 rounded-md text-gray-800 grow">
          {state === "init" && !title
            ? "Please wait for the host to prepare the next round.."
            : title}
        </h2>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 mt-5 w-full">
      <div className="flex w-full">
        <input
          type="text"
          title="vote-title"
          placeholder="What are we voting now ?"
          className="text-4xl py-3 px-1 focus:outline-gray-300 rounded-md text-gray-800 grow"
          value={txtTitle}
          onChange={({ target }) => setTxtTitle(target.value)}
        />
        <button
          title="edit"
          className="text-3xl pt-2 text-gray-900"
          onClick={() => updateRoundInfo({ title: txtTitle })}
        >
          <CiEdit />
        </button>
      </div>
      <DeckEditor
        currentDeck={roundInfo.deck ?? []}
        onConfirm={(deck) => updateRoundInfo({ deck })}
      />
    </div>
  );
};

export default RoomHeader;
