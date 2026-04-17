import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "@/modules/profile/api";
import UserCardSkeleton from "../skeleton/UserCardSkeleton";
import UserCard from "../shared/UserCard";
import { useMediaQuery } from "usehooks-ts";
import { twMerge } from "tailwind-merge";

const FameSidebar = () => {
  const inBigScreen = useMediaQuery("(min-width: 1000px)");
  const userQuery = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: getSuggestedUsers,
  });
  return (
    <div
      className={twMerge(
        "sticky top-0 col-span-1 h-screen p-4",
        inBigScreen ? "block" : "hidden",
      )}
    >
      <div className="rounded-xl bg-main-background px-4 text-main-primary">
        <h2 className="p-2 text-xl font-semibold">Who to follow</h2>
        <div className="flex flex-col gap-4">
          {userQuery.isLoading && (
            <>
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
            </>
          )}
          {userQuery.data && (
            <>
              <UserCard user={userQuery.data.admin} />
              {userQuery.data.suggestedUsers.map((suggestedUser) => (
                <UserCard key={suggestedUser._id} user={suggestedUser} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FameSidebar;
