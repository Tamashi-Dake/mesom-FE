import { useMemo } from "react";

import { mobileRoutes } from "../shared/config";
import MobileSidebarNav from "../shared/MobileSidebarNav";
import { useModal } from "../../hooks/useModal";
import { Link } from "react-router-dom";
import { TbLogout } from "react-icons/tb";
import { MdDisplaySettings } from "react-icons/md";
import DisplayModal from "@/modules/settings/components/DisplayModal";
import ActionLogout from "../../modules/auth/components/ActionLogout";
import { Modal } from "./Modal";

const MobileSidebarModal = ({ user }) => {
  const logoutModal = useModal();
  const displayModal = useModal();

  const routes = useMemo(() => {
    if (!user) return mobileRoutes;

    return mobileRoutes.map((route) => {
      if (route.path === "/profile") {
        return {
          ...route,
          path: `/profile/${user?.username}`,
        };
      }
      return route;
    });
  }, [user]);

  return (
    <>
      <aside className="flex flex-col gap-4 p-4 px-6">
        <div className="flex flex-col gap-4">
          <Link
            to={`/profile/${user?.username}`}
            className="flex flex-col items-center justify-center"
          >
            <div className="avatar mb-4 h-12 w-12 xs:hidden">
              <img
                src={user?.profile.avatarImg || "/placeholder.png"}
                alt="User Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="max-w-60 truncate text-lg font-semibold leading-none hover:underline">
                {user?.displayName || user?.username}
              </p>
              <p className="text-sm font-normal text-main-secondary">
                @{user?.username}
              </p>
            </div>
          </Link>

          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold">
                {user?.following.length}
              </span>
              <span className="text-base text-main-secondary">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base font-bold">
                {user?.followers.length}
              </span>
              <span className="text-base text-main-secondary">Followers</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          {routes.map((route) => (
            <MobileSidebarNav
              key={route.path}
              name={route.name}
              path={route.path}
              icon={route.icon}
              onClick={route.onClick}
            />
          ))}
          <MobileSidebarNav
            name={"Display"}
            icon={<MdDisplaySettings size={24} />}
            onClick={displayModal.openModal}
          />

          <MobileSidebarNav
            name={"Log Out"}
            icon={<TbLogout size={24} />}
            onClick={logoutModal.openModal}
          />
        </div>
      </aside>
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background relative rounded-2xl max-w-xl w-full my-8 overflow-hidden"
        open={displayModal.open}
        closeModal={displayModal.closeModal}
      >
        <DisplayModal closeModal={displayModal.closeModal} />
      </Modal>
      {logoutModal.open && <ActionLogout modal={logoutModal} />}
    </>
  );
};

export default MobileSidebarModal;
