import { useMemo, useState } from "react";

import { getMentions, getNotifications } from "../api";

import NotificationHeader from "../components/NotificationHeader";
import Notification from "../components/Notification";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Post from "@/modules/posts/components/Post";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { SEO } from "@/components/common/SEO";
import VirtualizedInfiniteList from "@/components/virtualizedInfiniteList";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("allNotifications");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteScroll(
    ["notifications", activeTab],
    ({ pageParam = 0 }) => {
      if (activeTab === "allNotifications") {
        return getNotifications({ skip: pageParam });
      }
      if (activeTab === "mentions") {
        return getMentions({ skip: pageParam });
      }
    },
    (lastPage) => lastPage.nextSkip || undefined,
  );

  const flatNotifications = useMemo(
    () => data?.pages.flatMap((page) => page.notifications ?? []) ?? [],
    [data],
  );

  const flatMentions = useMemo(
    () => data?.pages.flatMap((page) => page.mentions ?? []) ?? [],
    [data],
  );

  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

  const isEmpty = !!data?.pages[0]?.message;

  return (
    <div className="flex h-screen flex-col">
      <SEO title="Notifications / Mesom" />
      <NotificationHeader activeTab={activeTab} onTabChange={onTabChange} />
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {isEmpty && (
        <section className="mt-0.5 flex justify-center p-8">
          <div className="flex max-w-sm flex-col items-center gap-6">
            <span className="relative h-52 w-full overflow-hidden">
              <img
                alt="No Notifications"
                src="/no-notifications.png"
                className="absolute inset-0 m-auto object-cover p-0"
              />
            </span>
            <div className="flex flex-col gap-2 text-center">
              <p className="text-3xl font-extrabold text-main-primary">
                No{" "}
                {activeTab === "allNotifications" ? "notifications" : "mentions"}{" "}
                yet
              </p>
              <p className="text-main-secondary">
                When you get{" "}
                {activeTab === "allNotifications" ? "notifications" : "mentions"}
                , they'll show up here
              </p>
            </div>
          </div>
        </section>
      )}

      {!isLoading && !isEmpty && activeTab === "allNotifications" && (
        <VirtualizedInfiniteList
          key="allNotifications"
          items={flatNotifications}
          renderItem={(notification) => (
            <Notification notification={notification} />
          )}
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isFetchingMore={isFetchingNextPage}
          estimateSize={80}
          className="flex-1 min-h-0"
        />
      )}

      {!isLoading && !isEmpty && activeTab === "mentions" && (
        <VirtualizedInfiniteList
          key="mentions"
          items={flatMentions}
          renderItem={(mention) => (
            <Post
              post={mention.post}
              author={mention?.from}
              queryType={activeTab}
            />
          )}
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

export default NotificationsPage;
