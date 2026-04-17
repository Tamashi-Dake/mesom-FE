import TextArea from "react-textarea-autosize";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useCreatePost } from "@/hooks/usePost";
import { createPostSchema, type CreatePostFormData } from "../schema";

import CreatePostActions from "./CreatPostActions";
import ImageView from "@/components/shared/ImageView";
import { useCurrentUser } from "@/app/providers/authProvider";

const CreatePost = ({
  postId,
  isReply,
  authorName,
  refetch,
  queryType,
  onPost,
  modal = false,
}) => {
  const { currentUser } = useCurrentUser();
  const { postId: postParam } = useParams();

  const inReplyModal = postParam ? false : true;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { text: "" },
  });

  const text = watch("text");

  const { postMutate, previewImages, imgRef, submit, handleImgChange, handleRemoveImage } =
    useCreatePost(postId, isReply, authorName, inReplyModal, queryType, refetch);

  useEffect(() => {
    if (postMutate.isSuccess) {
      reset({ text: "" });
    }
  }, [postMutate.isSuccess, reset]);

  useEffect(() => {
    if (isReply) {
      !postId && toast.error("Missing parent post");
      if (postMutate.isSuccess && onPost) {
        onPost();
      }
    }
  }, [isReply, postId, postMutate.isSuccess]);

  const onSubmit = ({ text }: CreatePostFormData) => {
    submit(text);
  };

  const handleAddEmoji = (updater: (prev: string) => string) => {
    setValue("text", updater(text));
  };

  return (
    <div className="flex flex-1 items-start gap-4 border-b border-light-border bg-main-background p-4 dark:border-dark-border">
      <div className="avatar h-12 w-12 overflow-hidden rounded-full">
        <img
          className="h-full w-full object-cover"
          src={currentUser?.profile.avatarImg || "/placeholder.png"}
        />
      </div>
      <form
        className="flex w-[90%] flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextArea
          maxLength={currentUser?.verified ? 1000 : 400}
          minRows={3}
          maxRows={7}
          className="w-full resize-none bg-main-background p-0 text-lg text-main-primary focus:outline-none [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2"
          placeholder={isReply ? "Post your reply" : "What's happening?"}
          {...register("text")}
        />

        {errors.text && (
          <p className="text-sm text-red-500">{errors.text.message}</p>
        )}

        {previewImages.length > 0 && (
          <ImageView
            images={previewImages}
            imagesCount={previewImages.length}
            previewImage
            removeImage={handleRemoveImage}
          />
        )}

        <CreatePostActions
          verifiedUser={currentUser?.verified}
          handleAddEmoji={handleAddEmoji}
          textLength={text.length}
          imagesLength={previewImages.length}
          imgRef={imgRef}
          handleImgChange={handleImgChange}
          mutatePending={postMutate.isPending}
          modal={modal}
        />
      </form>
    </div>
  );
};
export default CreatePost;
