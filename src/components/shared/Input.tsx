import { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean;
  wrapperClassname?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, isPassword, disabled, onChange, className, wrapperClassname, ...props }, ref) => {
    const [show, setShow] = useState(false);

    const toggleVisibility = (e: React.MouseEvent) => {
      e.preventDefault();
      setShow(!show);
    };

    return (
      <div className={twMerge("relative flex", wrapperClassname)}>
        <input
          ref={ref}
          type={isPassword ? (show ? "text" : "password") : type}
          onChange={onChange}
          disabled={disabled}
          className={twMerge(
            "w-full rounded-md border-2 border-neutral-200 bg-neutral-100 px-4 py-2 text-lg text-neutral-900 placeholder-neutral-500 outline-none transition focus:border-2 focus:border-sky-500",
            disabled
              ? "cursor-not-allowed bg-neutral-500 opacity-70"
              : "cursor-text",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            className="absolute bottom-0 right-2 top-0"
            onClick={toggleVisibility}
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
