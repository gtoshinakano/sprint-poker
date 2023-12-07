import { useState } from "react";
import FlexibleInput from "./FlexibleInput";
import { IoCloseCircleSharp } from "react-icons/io5";

type DeckEditorProps = {
  currentDeck: string[];
  onConfirm: (newDeck: string[]) => void;
};

const DeckEditor = ({ currentDeck, onConfirm }: DeckEditorProps) => {
  const [deck, setDeck] = useState(currentDeck);
  const deckSet = new Set<string>(deck);
  const uniqueDeck = Array.from(deckSet);

  const onAdd = (value: string) => {
    deckSet.add(value);
    const newDeck = Array.from(deckSet);
    setDeck(newDeck);
    onConfirm(newDeck);
  };

  const onRemove = (value: string) => {
    deckSet.delete(value);
    const newDeck = Array.from(deckSet);
    setDeck(newDeck);
    onConfirm(newDeck);
  };

  return (
    <div className="flex gap-3">
      {uniqueDeck.map((card) => (
        <button
          key={card}
          className="text-3xl my-auto flex gap-1.5 rounded-md py-1.5 px-3 hover:bg-cyan-200 flex-col border-2 border-cyan-200 min-w-[60px] transform duration-75"
          onClick={() => onRemove(card)}
        >
          {card}
          <IoCloseCircleSharp className="mx-auto text-xl text-rose-400" />
        </button>
      ))}
      <FlexibleInput
        title="edit-deck"
        onConfirm={onAdd}
        maxLength={30}
        okText="Add Card"
        placeholder="Type here"
      />
    </div>
  );
};

export default DeckEditor;
