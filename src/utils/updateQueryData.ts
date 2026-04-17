import { QueryClient, QueryKey } from "@tanstack/react-query";

interface PostPage {
  posts: Array<{ _id: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

interface InfinitePostData {
  pages: PostPage[];
  pageParams: unknown[];
}

export const updatePostField = (
  queryClient: QueryClient,
  queryKey: QueryKey,
  postId: string,
  field: string,
  value: unknown,
): void => {
  queryClient.setQueryData<InfinitePostData>(queryKey, (existingData) => {
    if (!existingData) return undefined;

    return {
      ...existingData,
      pages: existingData.pages.map((page) => ({
        ...page,
        posts: page.posts.map((currentPost) =>
          currentPost._id === postId
            ? { ...currentPost, [field]: value }
            : currentPost,
        ),
      })),
    };
  });
};
