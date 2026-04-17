import { FaFeather } from "react-icons/fa6";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../modal/Modal";
import CreatePost from "@/modules/posts/components/CreatePost";
import { Button } from "@headlessui/react";

const RouteCreatePost = () => {
  const createPostModal = useModal();
  return (
    <>
      <div
        className="mx-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-main-accent p-4 transition hover:bg-opacity-80 sm:w-full"
        onClick={createPostModal.openModal}
      >
        <Button className="flex items-center justify-center gap-4">
          <FaFeather size={24} color="white" />
          <span className="hidden text-white xl:block">Create Post</span>
        </Button>
      </div>
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background relative rounded-2xl max-w-xl w-full my-8 overflow-visible"
        open={createPostModal.open}
        closeModal={createPostModal.closeModal}
      >
        <div className="ml-2 mr-5 mt-2">
          <CreatePost queryType={"forYou"} refetch />
        </div>
      </Modal>
    </>
  );
};

export default RouteCreatePost;
