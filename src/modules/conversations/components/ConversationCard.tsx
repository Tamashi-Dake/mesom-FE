import cn from "clsx";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { formatDate } from "@/utils/formatDate";

import { ToolTip } from "@/components/common/Tooltip";
import { Button } from "@headlessui/react";

import { IoIosMore } from "react-icons/io";
import { useCurrentUser } from "@/app/providers/authProvider";

const ConversationCard = ({ conversation, innerRef }) => {
  const { currentUser } = useCurrentUser();
  return (
    <Link
      ref={innerRef}
      to={`/conversation/${conversation._id}`}
      className="grid grid-cols-[auto,1fr] items-center justify-between px-4 py-2"
    >
      <div className="avatar relative flex h-12 w-12 rounded-full">
        {conversation.isGroup ? (
          // if conversation is group, show group image || first 3 participants' avatar
          conversation.avatar ? (
            <img
              className="h-full w-full object-cover"
              src={conversation.avatar || "/placeholder.png"}
            />
          ) : (
            conversation.participants
              .slice(0, 3)
              .map((participant, index) => (
                <img
                  key={participant._id}
                  className={twMerge(
                    "absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover",
                    index === 0 && "-translate-x-1 -translate-y-2",
                    index === 1 && "-translate-y-6",
                    index === 2 && "-translate-x-6 -translate-y-2",
                  )}
                  src={participant.profile?.avatarImg || "/placeholder.png"}
                />
              ))
          )
        ) : (
          (() => {
            const otherParticipant =
              conversation.participants.find(
                (participant) => participant._id !== currentUser?._id,
              ) || conversation.participants[0];
            return (
              <img
                className="h-full w-full rounded-full object-cover"
                src={otherParticipant?.profile?.avatarImg || "/placeholder.png"}
              />
            );
          })()
        )}
      </div>
      <div className="group flex min-w-0 items-center justify-between p-2">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-semibold tracking-tight text-main-primary hover:underline">
            {conversation.isGroup
              ? conversation.name
              : (() => {
                  const otherParticipant =
                    conversation.participants.find(
                      (participant) => participant._id !== currentUser?._id,
                    ) || conversation.participants[0];
                  return (
                    otherParticipant.displayName || otherParticipant.username
                  );
                })()}
          </span>
          <div className="flex min-w-0 gap-1 text-sm tracking-tight text-main-secondary">
            <span className="truncate">
              {conversation.lastMessage
                ? conversation.lastMessage.type !== "text"
                  ? " sends a file"
                  : conversation.lastMessage.text
                : "No messages yet"}
            </span>
            <span className="truncate">·</span>
            <span className="truncate">
              {conversation.lastMessage &&
                formatDate(conversation.lastMessage.createdAt, "post")}
            </span>
          </div>
        </div>
        {/* TODO: add Conversation option */}
        <Button
          className={cn(
            `main-tab group right-2 top-2 rounded-full p-2 hover:bg-main-accent/10 focus-visible:bg-main-accent/10 focus-visible:!ring-main-accent/80 active:bg-main-accent/20 group-hover:visible lg:invisible`,
            open && "bg-main-accent/10 [&>div>svg]:text-main-accent",
          )}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <div className="group relative">
            <IoIosMore className="h-5 w-5 text-light-secondary group-hover:text-main-accent group-focus-visible:text-main-accent dark:text-dark-secondary/80" />
            {!open && <ToolTip tip="More" />}
          </div>
        </Button>
      </div>
    </Link>
  );
};

export default ConversationCard;
