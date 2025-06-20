import api from "../helper/api";

export const createMessage = async ({ conversationId, postData }) => {
  const response = await api.post(
    `/conversation/${conversationId}/message`,
    postData,
  );
  return response.data;
};

export const getMessages = async ({ conversationId, skip }) => {
  const response = await api.get(`/conversation/${conversationId}/messages`, {
    params: {
      skip: skip,
    },
  });
  return response.data;
};
