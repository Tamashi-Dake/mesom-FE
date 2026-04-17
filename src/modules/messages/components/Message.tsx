import { twMerge } from "tailwind-merge";
import ImageView from "@/components/shared/ImageView";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { useCurrentUser } from "@/app/providers/authProvider";

const Message = ({ message, innerRef }) => {
  const { currentUser } = useCurrentUser();
  const [isMe, setIsMe] = useState(false);
  useEffect(() => {
    if (message.sender._id === currentUser?._id) setIsMe(true);
  }, [currentUser?._id, message.sender._id]);
  return (
    <div
      ref={innerRef}
      className={twMerge(
        "message clear-both flex max-w-[70%] gap-1",
        isMe ? "float-right flex-row-reverse" : "",
      )}
    >
      {/* sender avatar */}
      <div
        className={twMerge(
          "h-8 w-8 shrink-0 overflow-hidden rounded-full",
          isMe ? "hidden" : "",
        )}
      >
        <img
          className="h-full w-full object-cover"
          src={message.sender.profile?.avatarImg || "/placeholder.png"}
        />
      </div>
      <div className="content flex min-w-0 flex-col gap-1">
        {message.text && (
          <div
            className={twMerge(
              "w-fit rounded-xl p-2 text-sm tracking-tight",
              isMe
                ? "ml-auto bg-main-accent text-white"
                : "mr-auto bg-main-secondary/20 text-main-primary",
            )}
          >
            {message.text}
          </div>
        )}
        {message.images && message.images.length > 0 && (
          <div>
            <ImageView
              images={message.images}
              imagesCount={message.images.length}
              isMessage
            />
          </div>
        )}
        <div className="message-info flex gap-1 text-xs tracking-tighter text-main-secondary">
          <span className="truncate">
            {message.sender.displayName || message.sender.username}
          </span>
          <span>·</span>
          <span className="shrink-0">{formatDate(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
