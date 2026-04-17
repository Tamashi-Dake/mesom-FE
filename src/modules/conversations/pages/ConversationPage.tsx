import { redirect, useParams } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getConversation } from "../api";
import ConversationPageHeader from "../components/ConversationPageHeader";
import MessageInput from "@/modules/messages/components/MessageInput";
import { getMessages } from "@/modules/messages/api";
import Message from "@/modules/messages/components/Message";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentUser } from "@/app/providers/authProvider";
import {
  joinConversation,
  leaveConversation,
} from "../socketEvents";
import { EConversationSocketEvents } from "@/config/socketEvents";
import { useTranslation } from "react-i18next";
import { useSocket } from "@/app/providers/socketProvider";
import useChatInfiniteScroll from "@/modules/messages/hooks/useChatInfiniteScroll";

const ConversationPage = () => {
  const { conversationId } = useParams();
  const { t } = useTranslation();

  const messagesEndRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [userIsAtBottom, setUserIsAtBottom] = useState(true);

  const { currentUser } = useCurrentUser();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
  });

  const {
    messages,
    isFetchingMessages,
    isFetchingNextPageMessages,
    hasNextPageMessages,
    scrollContainerRef,
    scrollToBottom,
    isAtBottom,
    fetchMessages,
  } = useChatInfiniteScroll(
    ["conversation", conversationId, "messages"],
    ({ pageParam = 0 }) =>
      getMessages({ conversationId: conversationId, skip: pageParam }),
    (lastPage) => lastPage.nextSkip || undefined,
    { enabled: !!conversationId },
  );

  // Monitor scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollCheck = () => {
      setUserIsAtBottom(isAtBottom());
    };

    container.addEventListener("scroll", handleScrollCheck);
    return () => container.removeEventListener("scroll", handleScrollCheck);
  }, [isAtBottom]);

  // Auto scroll to bottom on first load
  useEffect(() => {
    if (
      shouldScrollToBottom &&
      !isFetchingMessages &&
      !isFetchingNextPageMessages
    ) {
      setTimeout(() => {
        scrollToBottom();
        setShouldScrollToBottom(false);
      }, 100);
    }
  }, [
    shouldScrollToBottom,
    isFetchingMessages,
    isFetchingNextPageMessages,
    scrollToBottom,
  ]);

  // Socket connection effects
  useEffect(() => {
    if (!socket || !currentUser?._id || !conversation?._id) return;

    if (currentUser._id && conversation._id) {
      joinConversation(socket, currentUser?._id, conversationId);
    } else {
      toast.error(t("somethingWentWrongTryAgainLater"));
      return;
    }

    return () => {
      leaveConversation(socket, currentUser?._id, conversationId);
    };
  }, [socket, currentUser, conversation]);

  const handleNewMessage = useCallback(
    (data) => {
      const { message, conversationId: msgConversationId, senderId } = data;

      queryClient.setQueryData(
        ["conversation", conversationId, "messages"],
        (oldMessagePage) => {
          if (!oldMessagePage) return oldMessagePage;

          const newPages = [...oldMessagePage.pages];
          const firstPage = newPages[0];
          const messageExists = firstPage.messages.some(
            (msg) => msg._id === message._id,
          );

          if (!messageExists) {
            newPages[0] = {
              ...firstPage,
              messages: [...firstPage.messages, message],
            };
          }

          return { ...oldMessagePage, pages: newPages };
        },
      );

      // Auto scroll to bottom if user is near bottom or if it's user's own message
      if (userIsAtBottom || senderId === currentUser?._id) {
        setTimeout(scrollToBottom, 100);
      }
    },
    [
      conversationId,
      currentUser?._id,
      queryClient,
      userIsAtBottom,
      scrollToBottom,
    ],
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(EConversationSocketEvents.newMessageReceived, handleNewMessage);

    return () => {
      socket.off(
        EConversationSocketEvents.newMessageReceived,
        handleNewMessage,
      );
    };
  }, [socket, handleNewMessage]);

  return (
    <>
      <SEO title={conversation?.name || "Message / Mesom"} />
      <div className="flex h-[100vh] flex-col overflow-auto">
        <ConversationPageHeader
          name={conversation?.name}
          onClick={() => redirect(`/conversation/${conversation?._id}/info`)}
        />

        <div
          ref={scrollContainerRef}
          className="flex-1 space-y-4 overflow-y-auto p-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2"
        >
          {/* Loading indicator at top when fetching more messages */}
          {isFetchingNextPageMessages ||
            (isFetchingMessages && (
              <div className="flex justify-center py-2">
                <LoadingSpinner />
              </div>
            ))}
          {messages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
          {!isFetchingMessages && messages.length === 0 && (
            <div className="text-center text-main-primary">
              {t("noMessagesYet")}
            </div>
          )}
          {/* Scroll to bottom anchor */}
          <div ref={messagesEndRef} />
        </div>
        {!userIsAtBottom && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-6 z-10 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors hover:bg-blue-600"
          >
            ↓
          </button>
        )}
        <MessageInput conversation={conversation} />
      </div>
    </>
  );
};

export default ConversationPage;
