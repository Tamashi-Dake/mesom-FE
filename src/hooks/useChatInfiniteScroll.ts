import { useEffect, useCallback, useRef, useMemo } from "react";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { IAppResponse, IMessagePages } from "@/types/common.types";

const useChatInfiniteScroll = (
  queryKey: QueryKey,
  queryFn: (context: any) => Promise<IAppResponse<any>>,
  getNextPageParam: (
    lastPage: IAppResponse<any>,
    allPages: IAppResponse<any>[],
  ) => unknown,
  options: any,
) => {
  const {
    data,
    fetchNextPage: fetchMessages,
    hasNextPage: hasNextPageMessages,
    isFetchingNextPage: isFetchingNextPageMessages,
    isFetching: isFetchingMessages,
  } = useInfiniteQuery<IMessagePages, Error>({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam: options.initialPageParam ?? null,
    staleTime: 30000,
    ...options,
  });

  const messages = useMemo(() => {
    const allMessages = [...(data?.pages || [])]
      .reverse()
      .flatMap((page) => page.messages);

    // TODO - High: Gửi tin nhắn mới => lệch skip/ cái gì đấy -> load thêm tin nhắn cũ vẫn dính 1/vài tin tùy theo số tin nhắn mới, càng load nhiều lần càng lặp nhiều lần
    // HACK: Loại bỏ duplicate dựa trên _id
    const uniqueMessages = allMessages.filter(
      (message, index, array) =>
        array.findIndex((m) => m._id === message._id) === index,
    );

    return uniqueMessages;
  }, [data]);
  // console.log(messages);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeightRef = useRef(0);

  // Handle scroll for chat (load more when scrolling up)
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop } = container;

    // Load more messages when scrolling near the top
    if (scrollTop < 100 && hasNextPageMessages && !isFetchingNextPageMessages) {
      previousScrollHeightRef.current = container.scrollHeight;
      fetchMessages();
    }
  }, [hasNextPageMessages, isFetchingNextPageMessages, fetchMessages]);

  // Maintain scroll position after loading new messages
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !data?.pages) return;

    // Only adjust scroll position if we just loaded new messages
    if (
      isFetchingNextPageMessages === false &&
      previousScrollHeightRef.current > 0
    ) {
      const currentScrollHeight = container.scrollHeight;
      const scrollDiff = currentScrollHeight - previousScrollHeightRef.current;

      if (scrollDiff > 0) {
        container.scrollTop = container.scrollTop + scrollDiff;
      }

      previousScrollHeightRef.current = 0;
    }
  }, [data, isFetchingNextPageMessages]);

  // Attach scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Check if user is at bottom
  const isAtBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return false;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  return {
    messages,
    isFetchingMessages,
    isFetchingNextPageMessages,
    hasNextPageMessages,
    scrollContainerRef,
    scrollToBottom,
    isAtBottom,
    fetchMessages,
  };
};

export default useChatInfiniteScroll;
