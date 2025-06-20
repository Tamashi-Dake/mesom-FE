import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createPost,
  createReply,
  deletePost,
  toggleBookmarkPost,
  toggleLikePost,
  toggleSharePost,
} from "../services/postsService";
import { updatePostField } from "../helper/updateQueryData";
import { useNavigate } from "react-router-dom";
import { maxFileSize } from "@/constants";

export const useCreatePost = (
  postId,
  isReply = false,
  authorName,
  inReplyModal = false,
  queryType,
  refetch = false,
) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const imgRef = useRef(null);

  const postMutate = useMutation({
    mutationFn: isReply ? createReply : createPost,
    onSuccess: (data) => {
      setText("");
      setImages([]);
      setPreviewImages([]);
      toast.success("Post created successfully");
      if (refetch) {
        queryClient.invalidateQueries({ queryKey: ["posts", queryType] });
      }
      if (isReply) {
        const { numberReplies } = data;

        if (inReplyModal) {
          queryClient.setQueryData(["posts", queryType], (existingPosts) => {
            return {
              ...existingPosts,
              pages: existingPosts.pages.map((page) => ({
                ...page,
                posts: page.posts.map((currentPost) =>
                  currentPost._id === postId
                    ? { ...currentPost, userReplies: numberReplies }
                    : currentPost,
                ),
              })),
            };
          });
        } else {
          queryClient.setQueryData(["post", postId], (oldData) => {
            if (!oldData) return;
            return {
              ...oldData,
              userReplies: numberReplies,
            };
          });
          queryClient.invalidateQueries({
            queryKey: ["post", postId, "reply"],
          });
        }
      }
    },
  });

  useEffect(() => {
    if (images)
      setPreviewImages(
        images.map((image) => ({
          id: image.id, // Tạo id duy nhất cho mỗi ảnh
          previewURL: image.previewURL, // Lưu URL base64 của ảnh
        })),
      );
  }, [images]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text && images.length === 0) {
      toast.error("Missing post content");
      return;
    }

    const postData = new FormData();
    if (isReply) {
      postData?.append("notificationType", "reply");
      postData.append("parentPost", postId);
      postData.append("authorName", authorName);
    }
    postData.append("text", text);
    images.forEach((image) => postData.append("images", image.file));

    postMutate.mutate(postData);
  };

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files);

    // Kiểm tra kích thước file
    const oversizedFiles = files.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      return toast.error(
        "One or more images are too large! Please select images smaller than 5MB.",
      );
    }

    if (files.length + images.length > 4) {
      return toast.error("Maximum number of images reached!");
    }

    const newImagesPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            id: `${file.name}-${Date.now()}`, // Dùng tên file và thời gian để tạo key
            name: file.name, // Lưu tên file
            previewURL: reader.result, // Lưu dữ liệu Base64
            file, // Lưu file gốc để upload
          });
        reader.onerror = (error) => {
          console.error("Error when reading images:", error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    // Sử dụng Promise.all để chờ tất cả các ảnh được đọc hoàn tất
    Promise.all(newImagesPromises)
      .then((newImages) => {
        if (images.length + newImages.length <= 4) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      })
      .catch((error) => console.error("Error loading images:", error));
  };
  const handleRemoveImage = useCallback((index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Xóa ảnh tại vị trí index
    imgRef.current.value = null; // Đặt lại input file
  }, []);

  return {
    postMutate,
    text,
    setText,
    previewImages,
    imgRef,
    handleSubmit,
    handleImgChange,
    handleRemoveImage,
  };
};

export const useDeletePost = (queryType, postId, postParam) => {
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      toast.success("Post deleted successfully");

      // Kiểm tra nếu queryType chứa "reply"
      if (queryType?.includes("reply")) {
        queryClient.invalidateQueries({
          queryKey: ["post", postParam, "reply"],
        });

        // Cập nhật số lượng userReplies cho bài viết gốc (post)
        queryClient.setQueryData(["post", postParam], (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            userReplies: data.numberReplies,
          };
        });
      } else if (postParam && postId) {
        // Nếu xóa post đang xem
        navigation("/");
        queryClient.invalidateQueries({ queryKey: ["post", postId] });
        queryClient.invalidateQueries({
          queryKey: ["post", postId, "reply"],
        });
      } else {
        // Nếu không phải reply và không ở trong post page
        queryClient.invalidateQueries({
          queryKey: ["posts", queryType],
        });
      }
    },
  });

  return deleteMutation;
};

export const useLikePost = (queryType, postId, inPostPage) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onSuccess: (data) => {
      const { likes } = data;
      // Đảm bảo queryType luôn là mảng
      const finalQueryType = Array.isArray(queryType) ? queryType : [queryType];

      if (inPostPage) {
        // Cập nhật query chi tiết bài đăng
        queryClient.setQueryData(["post", postId], (oldData) => {
          if (!oldData) return null;
          return {
            ...oldData,
            userLikes: likes,
          };
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

  return likeMutation;
};

export const useSharePost = (queryType, postId, inPostPage, refetch) => {
  const queryClient = useQueryClient();

  const shareMutation = useMutation({
    mutationFn: toggleSharePost,
    onSuccess: (data) => {
      const { shares } = data;
      // Đảm bảo queryType luôn là mảng
      const finalQueryType = Array.isArray(queryType) ? queryType : [queryType];

      if (inPostPage) {
        queryClient.setQueryData(["post", postId], (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            userShared: shares,
          };
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
        queryClient.invalidateQueries({
          queryKey: ["posts", ...finalQueryType],
        });
    },
    onError: (error) => {
      toast.error(`Error sharing post: ${error.message}`);
    },
  });

  return shareMutation;
};

export const useBookmarkPost = (
  queryType = "bookmarks",
  postId,
  inPostPage,
) => {
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmarkPost,
    onSuccess: (data) => {
      const { userBookmarks } = data;
      // Đảm bảo queryType luôn là mảng
      const finalQueryType = Array.isArray(queryType) ? queryType : [queryType];

      if (inPostPage) {
        queryClient.setQueryData(["post", postId], (oldData) => {
          if (!oldData) return;
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          return {
            ...oldData,
            userBookmarks: userBookmarks,
          };
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

  return bookmarkMutation;
};
