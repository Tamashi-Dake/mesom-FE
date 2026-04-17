import BackButton from "../shared/BackButton";
import HeaderWrapper from "./HeaderWrapper";

const DefaultHeader = ({
  label,
  additionalContent,
  showBackArrow = false,
  children,
  className,
}) => {
  return (
    <HeaderWrapper classname={className}>
      <div className="flex min-w-0 items-center gap-4">
        {showBackArrow && <BackButton />}
        <div className="flex min-w-0 max-w-full flex-col items-start truncate">
          <h1 className="truncate text-xl font-semibold leading-none">
            {label}
          </h1>
          <h2 className="text-sm text-neutral-500">{additionalContent}</h2>
        </div>
      </div>
      {children}
    </HeaderWrapper>
  );
};

export default DefaultHeader;
