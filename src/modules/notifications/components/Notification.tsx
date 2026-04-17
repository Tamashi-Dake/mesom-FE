import { Link } from "react-router-dom";
import { FaUser, FaHeart, FaRetweet, FaReply } from "react-icons/fa";

const NotificationIcon = ({ type }) => {
  switch (type) {
    case "follow":
      return <FaUser className="h-7 w-7 text-sky-500" />;
    case "like":
      return <FaHeart className="h-7 w-7 text-red-500" />;
    case "share":
      return <FaRetweet className="h-7 w-7 text-green-500" />;
    case "reply":
      return <FaReply className="h-7 w-7 text-blue-500" />;
    default:
      return null;
  }
};

const Notification = ({ notification, innerRef }) => {
  const link =
    notification?.type === "follow"
      ? `/profile/${notification.from.username}`
      : `/post/${notification.post}`;

  return (
    <div
      ref={innerRef}
      className="border-b border-light-border dark:border-dark-border"
      key={notification?._id}
    >
      <div className="flex gap-2 p-4">
        <NotificationIcon type={notification?.type} />
        <Link className="flex-1 text-main-primary" to={link}>
          <div className="avatar h-8 w-8">
            <img
              src={notification?.from.profile.avatarImg || "/placeholder.png"}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="flex gap-1">
            <span className="font-bold">@{notification?.from.username}</span>{" "}
            {notification?.type === "reply" && "replied to your post"}
            {notification?.type === "follow" && "started following you"}
            {notification?.type === "like" && "liked your post"}
            {notification?.type === "share" && "shared your post"}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Notification;
