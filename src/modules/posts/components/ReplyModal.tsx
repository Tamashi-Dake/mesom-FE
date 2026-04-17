import CreatePost from "./CreatePost";
import { Modal } from "@/components/modal/Modal";
import Post from "./Post";

const ReplyModal = ({ modal, post }) => {
  return (
    <Modal
      className="flex items-start justify-center"
      modalClassName="bg-main-background relative rounded-2xl max-w-xl w-full my-8 overflow-hidden"
      open={modal.open}
      closeModal={modal.closeModal}
    >
      <Post post={post} inReplyModal />
      {/* TODO: update queryType - create reply in user page (all, replies, medias, like), bookmark */}
      <CreatePost
        queryType={"forYou"}
        isReply={true}
        authorName={post.author.username}
        onPost={modal.closeModal}
        postId={post._id}
        modal
      />
    </Modal>
  );
};

export default ReplyModal;
