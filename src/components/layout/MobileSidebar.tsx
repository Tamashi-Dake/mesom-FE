import { useModal } from "../../hooks/useModal";
import { useCurrentUser } from "../../app/providers/authProvider";

import MobileSidebarModal from "../modal/MobileSidebarModal";
import { Modal } from "../modal/Modal";

const variant = {
  initial: { x: "-100%", opacity: 0.8 },
  animate: {
    x: -8,
    opacity: 1,
    transition: { type: "spring", duration: 0.8 },
  },
  exit: { x: "-100%", opacity: 0.8, transition: { duration: 0.4 } },
};

const MobileSidebar = () => {
  const { currentUser } = useCurrentUser();
  const modal = useModal();
  return (
    <>
      <Modal
        className="flex h-full items-start justify-start !p-0"
        modalAnimation={variant}
        modalClassName="bg-main-background text-main-primary relative max-w-xl"
        open={modal.open}
        closeModal={modal.closeModal}
      >
        <MobileSidebarModal user={currentUser} />
      </Modal>
      <div className="avatar h-8 w-8 xs:hidden" onClick={modal.openModal}>
        <img
          src={currentUser?.profile.avatarImg || "/placeholder.png"}
          alt="User Avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    </>
  );
};

export default MobileSidebar;
