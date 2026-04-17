import api from "@/lib/axios";

interface PaginationParams {
  skip: number;
}

export const getNotifications = async ({ skip }: PaginationParams) => {
  const response = await api.get("/notifications", {
    params: {
      skip: skip,
    },
  });
  return response.data;
};

export const getMentions = async ({ skip }: PaginationParams) => {
  const response = await api.get("/notifications/mentions", {
    params: {
      skip: skip,
    },
  });
  return response.data;
};

// TODO: Read/unread notifications,

//TODO: Only for Premium Users
export const deleteAllNotifications = async () => {
  const response = await api.delete(`/notifications`);
  return response.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};
