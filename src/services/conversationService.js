import api from "../helper/api";

export const checkCreateConversationConditions = async (postData) => {
  const response = await api.post(`conversation/check`, postData);
  return response.data;
};

export const createConversation = async (postData) => {
  const response = await api.post(`conversation`, postData);
  return response.data;
};

export const getConversation = async (conversationId) => {
  const response = await api.get(`/conversation/${conversationId}`);
  return response.data;
};

export const updateConversation = async ({ conversationId, updateData }) => {
  const response = await api.patch(
    `/conversation/${conversationId}`,
    updateData,
  );
  return response.data;
};

export const hideConversation = async (conversationId) => {
  const response = await api.post(`/conversation/${conversationId}/hide`);
  return response.data;
};
