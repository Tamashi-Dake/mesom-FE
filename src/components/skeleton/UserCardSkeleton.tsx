const UserCardSkeleton = () => {
  return (
    <div className="my-2 flex w-full animate-pulse flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-12 w-12 shrink-0 rounded-full bg-neutral-400"></div>
        <div className="flex flex-1 items-center justify-between px-2">
          <div className="flex flex-col gap-1">
            <div className="h-4 w-20 rounded-full bg-neutral-400"></div>
            <div className="h-3 w-24 rounded-full bg-neutral-400"></div>
          </div>
          <div className="h-6 w-20 rounded-full bg-neutral-400"></div>
        </div>
      </div>
    </div>
  );
};
export default UserCardSkeleton;
