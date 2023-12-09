import { LuLoader2 } from "react-icons/lu";

const Spinner = ({
  fullScreen,
  size,
}: {
  fullScreen?: boolean;
  size?: "lg" | "sm" | "md";
}) => (
  <div className={fullScreen ? "fixed w-screen h-screen flex z-50" : ""}>
    <LuLoader2
      className={`text-gray-700 animate-spin dark:text-gray-600 m-auto
      ${size === "sm" && "text-md"} 
      ${size === "md" && "text-xl"} 
      ${size === "lg" && "text-5xl"} 
      `}
    />
    <span className="text-2xl text-gray-700">Loading...</span>
  </div>
);

export default Spinner;
