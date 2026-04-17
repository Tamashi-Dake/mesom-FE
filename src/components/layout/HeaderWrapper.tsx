import { twMerge } from "tailwind-merge";

const HeaderWrapper = ({ children, classname }) => {
  return (
    <div
      className={twMerge(
        "sticky top-0 z-10 border-b-[1px] border-light-border bg-main-background p-4 text-main-primary backdrop-blur-xl dark:border-dark-border",
        classname,
      )}
    >
      {children}
    </div>
  );
};

export default HeaderWrapper;
