import api from "@/lib/axios";

interface CreateConversationData {
  participants: string[];
  name: string;
}

interface CheckConditionsData {
  participants: string[];
}

interface UpdateConversationParams {
  conversationId: string;
  updateData: Record<string, unknown>;
}

export const checkCreateConversationConditions = async (
  postData: CheckConditionsData,
) => {
  const response = await api.post(`conversation/check`, postData);
  return response.data;
};

export const createConversation = async (postData: CreateConversationData) => {
  const response = await api.post(`conversation`, postData);
  return response.data;
};

export const getConversation = async (conversationId: string) => {
  const response = await api.get(`/conversation/${conversationId}`);
  return response.data;
};

export const updateConversation = async ({
  conversationId,
  updateData,
}: UpdateConversationParams) => {
  const response = await api.patch(
    `/conversation/${conversationId}`,
    updateData,
  );
  return response.data;
};

export const hideConversation = async (conversationId: string) => {
  const response = await api.post(`/conversation/${conversationId}/hide`);
  return response.data;
};
