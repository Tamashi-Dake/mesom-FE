import { Button } from "@headlessui/react";
import { useFollowUser } from "../../hooks/useUser";
import { useCurrentUser } from "../../lib/context/authContext";

const FollowButton = ({ userId, refetchSingle }) => {
  const { currentUser } = useCurrentUser();
  const followUserMutation = useFollowUser(userId, refetchSingle);

  const isFollowing = currentUser?.following.includes(userId);

  const handleFollow = () => {
    followUserMutation.mutate({ userId: userId, notificationType: "follow" });
  };
  return (
    <>
      {isFollowing ? (
        <Button
          className='dark-bg-tab shrink rounded-2xl border border-light-line-reply px-4 py-1.5 font-bold transition-all hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red hover:before:content-["Unfollow"] inner:hover:hidden dark:border-light-secondary'
          onClick={(e) => {
            e.preventDefault();
            handleFollow();
          }}
        >
          <span className="text-sm">Following</span>
        </Button>
      ) : (
        <Button
          className="rounded-2xl border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/80 dark:focus-visible:bg-light-border/90 dark:active:bg-light-border/75"
          onClick={(e) => {
            e.preventDefault();
            handleFollow();
          }}
        >
          Follow
        </Button>
      )}
    </>
  );
};

export default FollowButton;
