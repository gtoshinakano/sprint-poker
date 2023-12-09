import { useState } from "react";
import { useRoomPlayers } from "../hooks/useRoomPlayers";

type PlayFooterProps = {
  onChange: (card: string | null) => void;
  deck: string[];
  userId: string;
};

const PlayFooter = ({ onChange, deck, userId }: PlayFooterProps) => {
  const deckSet = new Set(deck);
  const uniqueCards = Array.from(deckSet);
  const [selected, setSelected] = useState<string | null>(null);
  const { onlineUsers } = useRoomPlayers();

  const handleSelect = (card: string) => {
    setSelected(selected === card ? null : card);
    onChange(selected === card ? null : card);
  };

  const loggedUser = onlineUsers?.find(({ uid }) => uid === userId);
  const disabled = loggedUser?.isWatcher;

  return (
    <footer className="flex gap-4 m-auto">
      {uniqueCards.map((card) => (
        <button
          key={card}
          disabled={disabled}
          className={`${
            selected === card
              ? "-translate-y-6 bg-blue-100"
              : "hover:-translate-y-4"
          } 
          text-5xl h-36 w-28 border-4 rounded-lg border-blue-300 flex items-center justify-center text-gray-700 transform duration-100 hover:bg-sky-100
        `}
          onClick={() => handleSelect(card)}
        >
          <span className="m-auto">{card}</span>
        </button>
      ))}
    </footer>
  );
};

export default PlayFooter;
