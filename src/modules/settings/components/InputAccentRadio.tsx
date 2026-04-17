import cn from "clsx";
import { FaCheck } from "react-icons/fa6";
import { useTheme } from "@/app/providers/themeProvider";

const InputColors = {
  yellow:
    "bg-accent-yellow hover:ring-accent-yellow/10 active:ring-accent-yellow/20",
  blue: "bg-accent-blue hover:ring-accent-blue/10 active:ring-accent-blue/20",
  pink: "bg-accent-pink hover:ring-accent-pink/10 active:ring-accent-pink/20",
  purple:
    "bg-accent-purple hover:ring-accent-purple/10 active:ring-accent-purple/20",
  orange:
    "bg-accent-orange hover:ring-accent-orange/10 active:ring-accent-orange/20",
  green:
    "bg-accent-green hover:ring-accent-green/10 active:ring-accent-green/20",
};

export function InputAccentRadio({ type, changePreviewAccent, previewAccent }) {
  const { accent } = useTheme();

  const bgColor = InputColors[type];
  const isChecked = type === accent;
  const isPreview = type == previewAccent;

  return (
    <label
      className={cn(
        `hover-animation flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:ring`,
        bgColor,
      )}
      htmlFor={type}
    >
      <input
        className="peer absolute h-0 w-0 opacity-0"
        id={type}
        type="radio"
        name="accent"
        value={type}
        checked={isPreview ?? isChecked}
        onChange={changePreviewAccent}
      />
      <i className="text-white peer-checked:inner:opacity-100">
        <FaCheck className="h-6 w-6 opacity-0 transition-opacity duration-200" />
      </i>
    </label>
  );
}
