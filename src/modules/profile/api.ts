import api from "@/lib/axios";

export const getSuggestedUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserByUsername = async (username: string) => {
  const response = await api.get(`/user/${username}`);
  return response.data;
};

export const updateUser = async (postData: FormData) => {
  const response = await api.patch(`/user`, postData);
  return response.data;
};

export const toggleFollow = async ({
  userId,
  notificationType,
}: {
  userId: string;
  notificationType: string;
}) => {
  const response = await api.post(`/follow/${userId}`, { notificationType });
  return response.data;
};
