import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../modal/Modal";
import CreatePost from "@/modules/posts/components/CreatePost";

const FloatButton = ({ title, icon }) => {
  const createPostModal = useModal();
  return (
    <>
      <div
        className="fixed bottom-20 right-5 cursor-pointer rounded-full bg-main-accent p-4 transition hover:bg-opacity-80 xs:hidden"
        onClick={createPostModal.openModal}
      >
        <Link title={title}>{icon}</Link>
      </div>
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background relative rounded-2xl max-w-xl w-full my-8 overflow-hidden"
        open={createPostModal.open}
        closeModal={createPostModal.closeModal}
      >
        <div className="mr-5">
          <CreatePost queryType={"forYou"} refetch />
        </div>
      </Modal>
    </>
  );
};

export default FloatButton;
