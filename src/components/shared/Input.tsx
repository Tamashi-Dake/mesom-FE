import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const Input = ({
  type,
  isPassword,
  disabled,
  onChange,
  className,
  wrapperClassname,
  ...props
}) => {
  const [show, setShow] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    setShow(!show);
  };
  return (
    <div className={twMerge("relative flex", wrapperClassname)}>
      <input
        type={isPassword ? (show ? "text" : "password") : type}
        onChange={onChange}
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
};

export default Input;
