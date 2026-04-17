import { twMerge } from "tailwind-merge";
import { ToolTip } from "@/components/common/Tooltip";

const ProgressBar = ({
  modal,
  inputLimit,
  inputLength,
  isCharLimitExceeded,
}) => {
  const isCloseToLimit = inputLength >= inputLimit - 20;
  const baseCircle = baseOffset[+isCloseToLimit];

  const inputPercentage = (inputLength / inputLimit) * 100;
  const circleLength = baseCircle - (baseCircle * inputPercentage) / 100;

  const remainingCharacters = inputLimit - inputLength;
  const isHittingCharLimit = remainingCharacters <= 0;

  const { container, viewBox, stroke, r } = circleStyles[+isCloseToLimit];

  return (
    // TODO: Onclick show Ad modal
    <button
      className="group relative cursor-pointer outline-none"
      type="button"
    >
      <i
        className={twMerge(
          "flex h-5 w-5 -rotate-90 items-center justify-center transition",
          container,
          remainingCharacters <= -10 && "opacity-0",
        )}
      >
        <svg
          className="overflow-visible"
          width="100%"
          height="100%"
          viewBox={viewBox}
        >
          <circle
            className="stroke-neutral-200"
            cx="50%"
            cy="50%"
            fill="none"
            strokeWidth="2"
            r={r}
          />
          <circle
            className={twMerge(
              "transition-colors",
              isHittingCharLimit ? "stroke-red-500" : stroke,
            )}
            cx="50%"
            cy="50%"
            fill="none"
            strokeWidth="2"
            r={r}
            strokeLinecap="round"
            style={{
              strokeDashoffset: !isCharLimitExceeded ? circleLength : 0,
              strokeDasharray: baseCircle,
            }}
          />
        </svg>
      </i>
      <span
        className={twMerge(
          `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 text-xs opacity-0`,
          isCloseToLimit && "scale-100 text-yellow-500 opacity-100 transition",
          isHittingCharLimit && "text-red-500",
        )}
      >
        {remainingCharacters}
      </span>
      <ToolTip
        tip={
          isCharLimitExceeded
            ? "You have exceeded the character limit"
            : `${remainingCharacters} characters remaining`
        }
        modal={modal}
      />
    </button>
  );
};

const baseOffset = [56.5487, 87.9646];

const circleStyles = [
  {
    container: null,
    viewBox: "0 0 20 20",
    stroke: "stroke-main-accent",
    r: 9,
  },
  {
    container: "scale-150",
    viewBox: "0 0 30 30",
    stroke: "stroke-yellow-500",
    r: 14,
  },
];

export default ProgressBar;
