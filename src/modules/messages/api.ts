import api from "@/lib/axios";

interface CreateMessageParams {
  conversationId: string;
  postData: FormData;
}

interface GetMessagesParams {
  conversationId: string;
  skip: number;
}

export const createMessage = async ({
  conversationId,
  postData,
}: CreateMessageParams) => {
  const response = await api.post(
    `/conversation/${conversationId}/message`,
    postData,
  );
  return response.data;
};

export const getMessages = async ({
  conversationId,
  skip,
}: GetMessagesParams) => {
  const response = await api.get(`/conversation/${conversationId}/messages`, {
    params: {
      skip: skip,
    },
  });
  return response.data;
};
