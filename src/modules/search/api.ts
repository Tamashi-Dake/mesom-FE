import api from "@/lib/axios";

interface SearchParams {
  query: string;
  skip: number;
}

export const searchUsers = async ({ query, skip }: SearchParams) => {
  const response = await api.get("/search/users", {
    params: {
      query: query,
      skip: skip,
    },
  });
  return response.data;
};

export const searchConversations = async ({ query, skip }: SearchParams) => {
  const response = await api.get("/search/conversations", {
    params: {
      query: query,
      skip: skip,
    },
  });
  return response.data;
};
