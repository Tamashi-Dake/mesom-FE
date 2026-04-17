import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createPost,
  createReply,
  deletePost,
  toggleLikePost,
  toggleSharePost,
  toggleBookmarkPost,
} from "./api";
import { updatePostField } from "@/utils/updateQueryData";

export const useCreatePostMutation = (
  postId: string | undefined,
  isReply: boolean,
  inReplyModal: boolean,
  queryType: string,
  refetch: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: isReply ? createReply : createPost,
    onSuccess: (data) => {
      toast.success("Post created successfully");
      if (refetch) {
        queryClient.invalidateQueries({ queryKey: ["posts", queryType] });
      }
      if (isReply && postId) {
        const { numberReplies } = data;
        if (inReplyModal) {
          queryClient.setQueryData(["posts", queryType], (existingPosts: any) => {
            if (!existingPosts) return;
            return {
              ...existingPosts,
              pages: existingPosts.pages.map((page: any) => ({
                ...page,
                posts: page.posts.map((currentPost: any) =>
                  currentPost._id === postId
                    ? { ...currentPost, userReplies: numberReplies }
                    : currentPost,
                ),
              })),
            };
          });
        } else {
          queryClient.setQueryData(["post", postId], (oldData: any) => {
            if (!oldData) return;
            return { ...oldData, userReplies: numberReplies };
          });
          queryClient.invalidateQueries({ queryKey: ["post", postId, "reply"] });
        }
      }
    },
  });
};

export const useDeletePostMutation = (
  queryType: string | undefined,
  postId: string,
  postParam: string | undefined,
) => {
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      toast.success("Post deleted successfully");
      if (queryType?.includes("reply")) {
        queryClient.invalidateQueries({ queryKey: ["post", postParam, "reply"] });
        queryClient.setQueryData(["post", postParam], (oldData: any) => {
          if (!oldData) return;
          return { ...oldData, userReplies: data.numberReplies };
        });
      } else if (postParam && postId) {
        navigation("/");
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
        queryClient.invalidateQueries({ queryKey: ["post", postId, "reply"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["posts", queryType] });
      }
    },
  });
};

export const useLikePostMutation = (
  queryType: string | string[],
  postId: string,
  inPostPage: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleLikePost,
    onSuccess: (data) => {
      const { likes } = data;
      const finalQueryType = Array.isArray(queryType) ? queryType : [queryType];

      if (inPostPage) {
        queryClient.setQueryData(["post", postId], (oldData: any) => {
          if (!oldData) return null;
          return { ...oldData, userLikes: likes };
        });
      }

      updatePostField(
        queryClient,
        inPostPage ? ["post", ...finalQueryType] : ["posts", ...finalQueryType],
        postId,
        "userLikes",
        likes,
      );
    },
    onError: (error) => {
      toast.error(`Error liking post: ${error.message}`);
    },
  });
};

export const useSharePostMutation = (
  queryType: string | string[],
  postId: string,
  inPostPage: boolean,
  refetch?: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleSharePost,
    onSuccess: (data) => {
      const { shares } = data;
      const finalQueryType = Array.isArray(queryType) ? queryType : [queryType];

      if (inPostPage) {
        queryClient.setQueryData(["post", postId], (oldData: any) => {
          if (!oldData) return;
          return { ...oldData, userShared: shares };
        });
      }

      updatePostField(
        queryClient,
        inPostPage ? ["post", ...finalQueryType] : ["posts", ...finalQueryType],
        postId,
        "userShared",
        shares,
      );

      if (refetch)
        queryClient.invalidateQueries({ queryKey: ["posts", ...finalQueryType] });
    },
    onError: (error) => {
      toast.error(`Error sharing post: ${error.message}`);
    },
  });
};

export const useBookmarkPostMutation = (
  queryType: string | string[] = "bookmarks",
  postId: string,
  inPostPage: boolean,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBookmarkPost,
    onSuccess: (data) => {
      const { userBookmarks } = data;
      const finalQueryType = Array.isArray(queryType) ? queryType : [queryType];

      if (inPostPage) {
        queryClient.setQueryData(["post", postId], (oldData: any) => {
          if (!oldData) return;
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          return { ...oldData, userBookmarks };
        });
      }

      updatePostField(
        queryClient,
        inPostPage ? ["post", ...finalQueryType] : ["posts", ...finalQueryType],
        postId,
        "userBookmarks",
        userBookmarks,
      );

      queryClient.invalidateQueries({ queryKey: ["posts", "bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(`Error when bookmark: ${error.message}`);
    },
  });
};
