import { useMemo } from "react";
import { getUserBookmarks } from "../api";
import { useModal } from "@/hooks/useModal";

import Post from "../components/Post";
import BookmarkHeader from "../components/BookmarkHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Modal } from "@/components/modal/Modal";
import { ActionModal } from "@/components/modal/ActionModal";
import toast from "react-hot-toast";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { SEO } from "@/components/common/SEO";
import VirtualizedInfiniteList from "@/components/virtualizedInfiniteList";

const Bookmark = () => {
  const deleteAllBookmarkModal = useModal();

  const {
    data,
    error,
    isError,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteScroll(
    ["posts", "bookmarks"],
    ({ pageParam = 0 }) => {
      return getUserBookmarks({ skip: pageParam });
    },
    (lastPage) => lastPage.nextSkip || undefined,
  );

  const flatPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts ?? []) ?? [],
    [data],
  );

  const handleClear = () => {
    // TODO: Delete all bookmark + only allow Premium user
    deleteAllBookmarkModal.closeModal();
    toast.success("Successfully cleared all bookmarks");
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-screen flex-col">
      <SEO title="Bookmarks / Mesom" />
      <BookmarkHeader modal={deleteAllBookmarkModal} />
      {data?.pages[0]?.message ? (
        <section className="mt-0.5 flex justify-center p-8">
          <div className="flex max-w-sm flex-col items-center gap-6">
            <span className="relative h-52 w-full overflow-hidden">
              <img
                alt="No bookmarks"
                src="/no-bookmarks.png"
                className="absolute inset-0 m-auto object-cover p-0"
              />
            </span>
            <div className="flex flex-col gap-2 text-center">
              <p className="text-3xl font-extrabold text-main-primary">
                Save Posts for later
              </p>
              <p className="text-main-secondary">
                Don't let the good ones fly away! Bookmark Posts to easily find
                them again in the future.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <VirtualizedInfiniteList
          items={flatPosts}
          renderItem={(post) => <Post post={post} queryType="bookmarks" />}
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isFetchingMore={isFetchingNextPage}
          estimateSize={200}
          className="flex-1 min-h-0"
        />
      )}
      <Modal
        modalClassName="max-w-xs relative bg-main-background bg-white w-full p-8 rounded-2xl"
        open={deleteAllBookmarkModal.open}
        closeModal={deleteAllBookmarkModal.closeModal}
        actionModal
      >
        <ActionModal
          useIcon
          title="Clear all Bookmarks?"
          description="This can't be undone and you'll remove all Tweets you've added to your Bookmarks."
          mainBtnClassName="bg-accent-red bg-red-500 hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab focus-visible:bg-accent-red/90"
          mainBtnLabel="Clear"
          action={handleClear}
          closeModal={deleteAllBookmarkModal.closeModal}
        />
      </Modal>
    </div>
  );
};

export default Bookmark;
