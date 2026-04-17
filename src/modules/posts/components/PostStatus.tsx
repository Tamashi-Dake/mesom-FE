import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const PostStatus = ({ totalReplies, userLikes, userShares }) => {
  const totalLikes = userLikes.length;
  const totalShares = userShares.length;

  const [{ currentReplies, currentTweets, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalShares,
    });

  useEffect(() => {
    setCurrentStats({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalShares,
    });
  }, [totalReplies, totalLikes, totalShares]);

  const isStatsVisible = !!(totalReplies || totalShares || totalLikes);

  const allStats = [
    ["Reply", null, currentReplies],
    ["Share", "Shares", currentTweets],
    ["Like", "likes", currentLikes],
  ];

  //   TODO: Add Users share/like modal
  return (
    <>
      {isStatsVisible && (
        <div className="flex gap-4 border-y-[1px] border-light-border py-4 text-main-secondary dark:border-dark-border [&>button>div]:font-bold [&>button>div]:text-main-primary">
          {allStats.map(
            ([title, type, stats], index) =>
              !!stats && (
                <button
                  className={twMerge(
                    `hover-animation mb-[3px] mt-0.5 flex h-4 items-center gap-1 border-b border-b-transparent text-sm outline-none hover:border-b-light-primary focus-visible:border-b-light-primary dark:hover:border-b-dark-primary dark:focus-visible:border-b-dark-primary`,
                    index === 0 && "cursor-not-allowed",
                  )}
                  key={title}
                  //   onClick={type ? handleOpen(type) : undefined}
                >
                  <span className="font-semibold">{stats}</span>
                  <p className="text-main-secondary">{`${
                    stats === 1
                      ? title
                      : stats > 1 && index === 0
                        ? `${title.slice(0, -1)}ies`
                        : `${title}s`
                  }`}</p>
                </button>
              ),
          )}
        </div>
      )}
    </>
  );
};

export default PostStatus;
