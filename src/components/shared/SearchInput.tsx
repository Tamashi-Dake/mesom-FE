import { twMerge } from "tailwind-merge";

const SearchInput = ({ label, placeholder, value, onChange, className }) => {
  return (
    <form className="flex-1">
      <label htmlFor="default-search" className="sr-only">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          id="default-search"
          className={twMerge(
            "block w-full rounded-lg border border-main-secondary bg-main-background p-4 ps-10 text-sm text-main-primary focus:border-main-accent focus:outline-none focus:ring-main-accent",
            className,
          )}
          placeholder={placeholder}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
};

export default SearchInput;
