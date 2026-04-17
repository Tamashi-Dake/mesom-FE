import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import cn from "clsx";

import { useModal } from "@/hooks/useModal";
import {
  useBookmarkPost,
  useLikePost,
  useSharePost,
} from "@/hooks/usePost";

import { omit } from "@/utils/object";
import { increasePostView } from "../api";

import ReplyModal from "./ReplyModal";
import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";

import { FaHeart, FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaBookmark, FaCopy, FaRegBookmark } from "react-icons/fa6";
import { IoShareOutline, IoStatsChartSharp } from "react-icons/io5";
import { ToolTip } from "@/components/common/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { popupVariant } from "@/components/shared/config";
import toast from "react-hot-toast";
import { useCurrentUser } from "@/app/providers/authProvider";

const PostActions = ({ post, queryType }) => {
  const { postId: postParam, username: userParam } = useParams();
  const [debouncedPending, setDebouncedPending] = useState(false);
  const { currentUser } = useCurrentUser();
  const replyModal = useModal();

  const inPostPage = !!postParam;
  const isViewingPost = postParam === post._id;
  const isViewingMyProfile = userParam === currentUser?.username;
  const keysToOmit = [
    "userLikes",
    "userShared",
    "userReplies",
    "tags",
    "views",
  ];
  const simplifiedPost = omit(post, keysToOmit);
  const isLiked = post.userLikes.includes(currentUser?._id);
  const isShared = post.userShared.includes(currentUser?._id);
  const isBookmarked = currentUser?.bookmarks.some(
    (bookmark) => bookmark.post === post._id,
  );

  const likeMutation = useLikePost(queryType, post._id, inPostPage);
  const shareMutation = useSharePost(
    queryType,
    post._id,
    inPostPage,
    isViewingMyProfile,
  );
  const bookmarkMutation = useBookmarkPost(queryType, post._id, inPostPage);
  const mutatePending =
    likeMutation.isPending ||
    shareMutation.isPending ||
    bookmarkMutation.isPending;

  const viewMutation = useMutation({
    mutationFn: increasePostView,
    onError: (error) => {
      console.error(`Error increase view: ${error.message}`);
    },
  });

  useEffect(() => {
    // TODO: Test view again in Production - trong dev vẫn bị call 2 lần do strict mode
    if (isViewingPost) viewMutation.mutate(postParam);
  }, [isViewingPost]);

  useEffect(() => {
    if (mutatePending) {
      setDebouncedPending(true);
      const timeoutId = setTimeout(() => setDebouncedPending(false), 500);
      return () => clearTimeout(timeoutId);
    } else setDebouncedPending(false);
  }, [mutatePending]);

  const handleReply = (event) => {
    event.preventDefault();
    replyModal.openModal();
  };

  const handleLikePost = (event) => {
    event.preventDefault();
    if (debouncedPending) return;
    likeMutation.mutate({ postId: post._id, notificationType: "like" });
  };

  const handleSharePost = (event) => {
    event.preventDefault();
    if (debouncedPending) return;
    shareMutation.mutate({ postId: post._id, notificationType: "share" });
  };

  const handleBookmark = () => {
    if (debouncedPending) return;
    bookmarkMutation.mutate({ postId: post._id });
  };

  const handleCopy = async (event, close) => {
    event.preventDefault();
    try {
      const postUrl = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard. Please try again.");
    }
    close();
  };

  return (
    <div className="mt-2 flex justify-between">
      <div className="flex w-4/5 items-center justify-between gap-4">
        <Button
          className={twMerge(
            "group flex items-center gap-1",
            postParam ? "cursor-not-allowed" : "",
          )}
          onClick={postParam ? null : handleReply}
        >
          <span className="h-8 w-8 rounded-full p-2 transition-all ease-in-out group-hover:bg-sky-500/10">
            <FaRegComment className="text-main-primary group-hover:text-main-accent/80" />
          </span>

          <span className="text-sm text-main-primary group-hover:text-main-accent/80">
            {post.userReplies > 0 ? post.userReplies : ""}
          </span>
        </Button>
        {replyModal.open && (
          <ReplyModal
            modal={replyModal}
            post={simplifiedPost}
            queryType={queryType}
          />
        )}
        <Button
          className={twMerge(
            "group flex items-center gap-1",
            mutatePending && "cursor-not-allowed",
          )}
          disabled={mutatePending}
          onClick={handleSharePost}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all ease-in-out group-hover:bg-green-500/10">
            <BiRepost
              className={twMerge(
                "h-6 w-6 text-main-primary group-hover:text-green-500",
                isShared ? "text-green-500 group-hover:text-green-600" : "",
              )}
            />
          </span>
          <span className="text-sm text-main-primary group-hover:text-green-500">
            {post.userShared.length > 0 ? post.userShared.length : ""}
          </span>
        </Button>
        <Button
          className={twMerge(
            "group flex items-center gap-1",
            mutatePending && "cursor-not-allowed",
          )}
          disabled={mutatePending}
          onClick={handleLikePost}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full p-2 transition-all ease-in-out group-hover:bg-pink-500/10">
            {!isLiked && (
              <FaRegHeart className="text-main-primary group-hover:text-pink-500" />
            )}
            {isLiked && (
              <FaHeart className="text-pink-500 group-hover:text-pink-600" />
            )}
          </span>

          <span
            className={`text-sm group-hover:text-pink-500 ${
              isLiked ? "text-pink-500" : "text-main-primary"
            }`}
          >
            {post.userLikes.length > 0 ? post.userLikes.length : ""}
          </span>
        </Button>
        <Button
          className={twMerge(
            "group flex items-center gap-1",
            mutatePending && "cursor-not-allowed",
          )}
          disabled={mutatePending}
          onClick={(e) => {
            e.preventDefault();
            inPostPage ? handleBookmark() : alert("Open Action modal - View");
          }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full p-2 transition-all ease-in-out group-hover:bg-blue-500/10">
            {isViewingPost ? (
              <>
                {!isBookmarked && (
                  <FaRegBookmark className="text-main-primary group-hover:text-blue-500" />
                )}
                {isBookmarked && (
                  <FaBookmark className="text-blue-500 group-hover:text-blue-600" />
                )}
              </>
            ) : (
              <IoStatsChartSharp className="text-main-primary group-hover:text-main-accent" />
            )}
          </span>
          <span
            className={`text-sm group-hover:text-blue-500 ${
              (isBookmarked ? "text-blue-500" : "text-main-primary",
              !inPostPage
                ? "text-main-primary group-hover:text-main-accent"
                : "group-hover:text-blue-500")
            }`}
          >
            {isViewingPost
              ? post.userBookmarks > 0
                ? post.userBookmarks
                : ""
              : post.views}
          </span>
        </Button>
      </div>
      <div className="flex items-center justify-end xs:w-1/5">
        {!isViewingPost && (
          <Button
            className={twMerge(
              "group flex items-center",
              mutatePending && "cursor-not-allowed",
            )}
            disabled={mutatePending}
            onClick={(e) => {
              e.preventDefault();
              handleBookmark();
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all ease-in-out group-hover:bg-blue-500/10 xs:p-2">
              {!isBookmarked && (
                <FaRegBookmark className="text-main-primary group-hover:text-blue-500" />
              )}
              {isBookmarked && (
                <FaBookmark className="text-blue-500 group-hover:text-blue-600" />
              )}
            </span>
          </Button>
        )}
        <Popover>
          {({ open, close }) => (
            <>
              <PopoverButton
                as={Button}
                className={cn(
                  `main-tab group right-2 top-2 rounded-full hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20 xs:p-2`,
                  open && "bg-accent-blue/10 [&>div>svg]:text-accent-blue",
                )}
              >
                <div className="group relative">
                  <IoShareOutline className="h-5 w-5 text-main-primary group-hover:text-accent-blue group-focus-visible:text-accent-blue" />
                  {!open && <ToolTip tip="Share" />}
                </div>
              </PopoverButton>
              <AnimatePresence>
                {open && (
                  <PopoverPanel
                    className="menu-container group absolute right-2 z-[9] whitespace-nowrap bg-main-background text-main-primary"
                    as={motion.div}
                    {...popupVariant}
                    static
                  >
                    <PopoverButton
                      as={Button}
                      className="accent-tab flex w-full items-center gap-3 rounded-md rounded-b-none p-4 text-main-primary hover:bg-main-sidebar-background"
                      onClick={(event) => handleCopy(event, close)}
                    >
                      <FaCopy />
                      Copy to clipboard
                    </PopoverButton>
                  </PopoverPanel>
                )}
              </AnimatePresence>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default PostActions;
