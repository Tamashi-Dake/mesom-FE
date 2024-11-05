import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getMentions,
  getNotifications,
} from "../services/notificationsService";

import NotificationHeader from "../components/layout/NotificationHeader";
import Notification from "../components/notification/Notification";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Post from "../components/post/Post";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("allNotifications");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", activeTab],
    queryFn: () => {
      if (activeTab === "allNotifications") {
        return getNotifications();
      }
      if (activeTab === "mentions") {
        return getMentions();
      }
    },
  });

  const onTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <NotificationHeader activeTab={activeTab} onTabChange={onTabChange} />
      <div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner />
          </div>
        )}
        {data?.totalNotifications === 0 && (
          <div className="text-center p-4 font-bold">
            You have no notifications{" "}
          </div>
        )}

        {activeTab === "allNotifications" &&
          data?.notifications?.map((notification) => (
            <Notification key={notification._id} notification={notification} />
          ))}
        {activeTab === "mentions" &&
          data?.mentions?.map((mention) => (
            // TODO: Bug : mention.from chỉ có id?
            <Post
              key={mention.post._id}
              post={mention.post}
              author={mention?.from}
              queryType={activeTab}
            />
          ))}
      </div>
    </>
  );
};

export default Notifications;
