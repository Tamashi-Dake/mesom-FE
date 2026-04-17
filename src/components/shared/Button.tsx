import { twMerge } from "tailwind-merge";

const Button = ({
  label,
  secondary,
  onClick,
  disabled,
  outline,
  className,
}) => {
  return (
    <button
      className={twMerge(
        "rounded-full px-4 py-2 font-semibold transition duration-300 ease-in-out hover:opacity-90",
        secondary
          ? "border-neutral-700 bg-neutral-800 text-white"
          : "border-main-accent/80 bg-main-accent text-white",
        outline ? "border-sky-500 bg-transparent text-sky-500" : "",
        disabled ? "cursor-not-allowed opacity-70" : "hover:bg-primary-600",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
