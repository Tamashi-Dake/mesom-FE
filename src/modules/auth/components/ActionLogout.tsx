import { Modal } from "@/components/modal/Modal";
import { ActionModal } from "@/components/modal/ActionModal";
import { useLogoutMutation } from "../queries";

const ActionLogout = ({ modal }) => {
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <Modal
      modalClassName="max-w-xs relative text-main-primary bg-main-background w-full p-8 rounded-2xl"
      open={modal.open}
      closeModal={modal.closeModal}
      actionModal
    >
      <ActionModal
        title="Log out of Mesom?"
        description={`You can always log back in at any time. If you log out, you will need to have your username and password to log back in.`}
        mainBtnClassName="bg-main-accent/80 hover:bg-main-accent "
        mainBtnLabel="Log out"
        action={handleLogout}
        closeModal={modal.closeModal}
      />
    </Modal>
  );
};

export default ActionLogout;
