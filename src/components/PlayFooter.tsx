import { useState } from "react";

type PlayFooterProps = {
  onChange: (card: string) => void;
  deck: string[];
};

const PlayFooter = ({ onChange, deck }: PlayFooterProps) => {
  const deckSet = new Set(deck);
  const uniqueCards = Array.from(deckSet);
  const [selected, setSelected] = useState("");

  const handleSelect = (card: string) => {
    setSelected(selected === card ? "" : card);
    onChange(selected === card ? "" : card);
  };

  return (
    <footer className="flex gap-4">
      {uniqueCards.map((card) => (
        <button
          key={card}
          className={`${selected === card ? "-translate-y-4 bg-blue-100" : ""} 
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
