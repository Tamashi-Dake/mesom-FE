import { useMemo, useState } from "react";
import { getFollowingPosts, getPosts } from "../api";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

import HomeHeader from "../components/HomeHeader";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { SEO } from "@/components/common/SEO";
import VirtualizedInfiniteList from "@/components/virtualizedInfiniteList";
import { useMediaQuery } from "usehooks-ts";

const Home = () => {
  const [queryType, setFeedType] = useState("forYou");
  const isMobile = useMediaQuery("(max-width: 500px)");

  const {
    data,
    error,
    isError,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteScroll(
    ["posts", queryType],
    ({ pageParam = 0 }) => {
      if (queryType === "forYou") {
        return getPosts({ skip: pageParam });
      }
      if (queryType === "following") {
        return getFollowingPosts({ skip: pageParam });
      }
    },
    (lastPage) => lastPage.nextSkip || undefined,
  );

  const flatPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts ?? []) ?? [],
    [data],
  );

  const handleTabChange = (tab) => {
    setFeedType(tab);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-screen flex-col">
      <SEO
        title="Home / Mesom"
        description="This is Mesom, where you join discussions about the latest news."
      />
      <HomeHeader activeTab={queryType} onTabChange={handleTabChange} />
      {!isMobile && <CreatePost queryType={queryType} refetch />}
      {data?.pages[0]?.message ? (
        <section className="mt-0.5 flex justify-center p-8">
          <div className="flex max-w-sm flex-col items-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-3xl font-extrabold text-main-primary">
                Welcome to Mesom!
              </p>
              <p className="text-main-secondary">
                When you follow someone, their posts will show up here. Find
                some people to follow now.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <VirtualizedInfiniteList
          key={queryType}
          items={flatPosts}
          renderItem={(post) => <Post post={post} queryType={queryType} />}
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isFetchingMore={isFetchingNextPage}
          estimateSize={200}
          className="flex-1 min-h-0"
        />
      )}
    </div>
  );
};

export default Home;
