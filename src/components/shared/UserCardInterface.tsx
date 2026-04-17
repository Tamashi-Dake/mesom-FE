import { twMerge } from "tailwind-merge";

const UserCardInterface = ({ user, innerRef, openSpace, onClick }) => {
  return (
    <div
      onClick={onClick}
      ref={innerRef}
      className={twMerge(
        "grid grid-cols-[auto,1fr] items-center justify-between hover:bg-main-secondary/10",
        openSpace ? "px-4 py-2" : "max-w-[260px]",
      )}
    >
      <div className="avatar h-12 w-12 overflow-hidden rounded-full">
        <img
          className="h-full w-full object-cover"
          src={user.profile?.avatarImg || "/placeholder.png"}
        />
      </div>
      <div className="flex items-center justify-between p-2">
        <div className="flex flex-col">
          <span className="w-28 truncate font-semibold tracking-tight hover:underline">
            {user.displayName || user.username}
          </span>
          <span className="w-28 truncate text-sm text-slate-500">
            @{user.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCardInterface;
