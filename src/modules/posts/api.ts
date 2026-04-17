import api from "@/lib/axios";

export const getPosts = async ({ skip }: { skip: number }) => {
  const response = await api.get("/posts", { params: { skip } });
  return response.data;
};

export const getFollowingPosts = async ({ skip }: { skip: number }) => {
  const response = await api.get("/posts/following", { params: { skip } });
  return response.data;
};

export const getUserBookmarks = async ({ skip }: { skip: number }) => {
  const response = await api.get("/posts/bookmarks", { params: { skip } });
  return response.data;
};

export const getPostsByUser = async ({ userId, skip }: { userId: string; skip: number }) => {
  const response = await api.get(`/user/${userId}/posts`, { params: { skip } });
  return response.data;
};

export const getRepliesByUser = async ({ userId, skip }: { userId: string; skip: number }) => {
  const response = await api.get(`/user/${userId}/replies`, { params: { skip } });
  return response.data;
};

export const getMediasByUser = async ({ userId, skip }: { userId: string; skip: number }) => {
  const response = await api.get(`/user/${userId}/medias`, { params: { skip } });
  return response.data;
};

export const getLikesByUser = async ({ userId, skip }: { userId: string; skip: number }) => {
  const response = await api.get(`/user/${userId}/likes`, { params: { skip } });
  return response.data;
};

export const getPost = async (postId: string) => {
  const response = await api.get(`/post/${postId}`);
  return response.data;
};

export const getRepliesForPost = async ({ postId, skip }: { postId: string; skip: number }) => {
  const response = await api.get(`/post/${postId}/replies`, { params: { skip } });
  return response.data;
};

export const createPost = async (postData: FormData) => {
  const response = await api.post("/post", postData);
  return response.data;
};

export const createReply = async (replyData: FormData) => {
  const response = await api.post(
    `/post/${replyData.get("parentPost")}`,
    replyData,
  );
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await api.delete(`/post/${postId}`);
  return response.data;
};

export const toggleLikePost = async ({ postId, notificationType }: { postId: string; notificationType: string }) => {
  const response = await api.post(`/post/${postId}/like`, { notificationType });
  return response.data;
};

export const toggleSharePost = async ({ postId, notificationType }: { postId: string; notificationType: string }) => {
  const response = await api.post(`/post/${postId}/share`, { notificationType });
  return response.data;
};

export const toggleBookmarkPost = async ({ postId }: { postId: string }) => {
  const response = await api.post(`/post/${postId}/bookmark`);
  return response.data;
};

export const increasePostView = async (postId: string) => {
  const response = await api.post(`/post/${postId}/increase-view`);
  return response.data;
};
