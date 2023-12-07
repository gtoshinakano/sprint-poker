import { useEffect, useRef, useState } from "react";

type FlexibleInputProps = {
  title?: string;
  defaultValue?: string;
  maxLength?: number;
  okText?: string;
  onConfirm: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const FlexibleInput = ({
  title,
  defaultValue,
  okText,
  onConfirm,
  maxLength,
  placeholder,
  disabled,
}: FlexibleInputProps) => {
  const hiddenElement = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);
  const [input, setInput] = useState(defaultValue ?? "");

  useEffect(() => {
    const { current } = hiddenElement;
    if (current) {
      setWidth(current.offsetWidth);
    }
  }, [input]);

  const handleConfirm = () => {
    onConfirm(input ?? "");
    setInput("");
  };

  return (
    <div className="relative flex my-auto gap-2">
      <span
        ref={hiddenElement}
        className="fixed invisible px-1.5 whitespace-pre min-w-[45px] text-2xl"
      >
        {input.length > 0 ? input : placeholder}
      </span>
      <input
        style={{
          width,
        }}
        className="p-1.5 border border-cyan-700 min-w-[45px] text-2xl rounded-md disabled:cursor-not-allowed"
        title={title}
        maxLength={maxLength}
        placeholder={placeholder}
        value={input}
        onChange={({ target }) => setInput(target.value)}
        disabled={disabled}
      />
      <button
        className="py-1.5 px-3 text-white bg-cyan-700 rounded-md disabled:cursor-not-allowed disabled:bg-gray-400"
        onClick={handleConfirm}
        disabled={!input || disabled}
      >
        {okText ?? "OK"}
      </button>
    </div>
  );
};

export default FlexibleInput;
