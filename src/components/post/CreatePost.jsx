import TextArea from "react-textarea-autosize";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { useCreatePost } from "../../hooks/usePost";

import CreatePostActions from "./CreatPostActions";
import ImageView from "../shared/ImageView";
import { useCurrentUser } from "../../lib/context/authContext";

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
    postMutate,
    text,
    setText,
    previewImages,
    imgRef,
    handleSubmit,
    handleImgChange,
    handleRemoveImage,
  } = useCreatePost(
    postId,
    isReply,
    authorName,
    inReplyModal,
    queryType,
    refetch,
  );

  // TODO: cần check khi reply trong Post page
  useEffect(() => {
    if (isReply) {
      !postId && toast.error("Missing parent post");
      if (postMutate.isSuccess && onPost) {
        onPost();
      }
    }
  }, [isReply, postId, postMutate.isSuccess]);

  return (
    <div className="flex flex-1 items-start gap-4 border-b border-light-border bg-main-background p-4 dark:border-dark-border">
      <div className="avatar h-12 w-12 overflow-hidden rounded-full">
        <img
          className="h-full w-full object-cover"
          src={currentUser?.profile.avatarImg || "/placeholder.png"}
        />
      </div>
      <form className="flex w-[90%] flex-col gap-2" onSubmit={handleSubmit}>
        {/* TODO: Add Paste image from clipboard */}
        <TextArea
          maxLength={currentUser?.verified ? 1000 : 400}
          minRows={3}
          maxRows={7}
          className="w-full resize-none bg-main-background p-0 text-lg text-main-primary focus:outline-none [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2"
          placeholder={isReply ? "Post your reply" : "What's happening?"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

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
          handleAddEmoji={setText}
          textLength={text.length}
          imagesLength={previewImages.length}
          imgRef={imgRef}
          handleImgChange={handleImgChange}
          mutatePending={postMutate.isPending}
          modal={modal}
        />

        {postMutate.isError && toast.error(postMutate.error.message)}
      </form>
    </div>
  );
};
export default CreatePost;
