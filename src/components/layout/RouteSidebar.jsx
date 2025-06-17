import { useMemo } from "react";

import { routes as staticRoutes } from "../shared/config";
import RouteItem from "../shared/RouteItem";
import RouteCreatePost from "../shared/RouteCreatePost";
import Button from "../shared/Button";
import { TbLogout } from "react-icons/tb";
import ActionLogout from "../modal/ActionLogout";
import { useModal } from "../../hooks/useModal";
import DisplaySettings from "../shared/DisplaySetting";
import { useCurrentUser } from "../../lib/context/authContext";

const RouteSidebar = () => {
  const { currentUser } = useCurrentUser();
  const logoutModal = useModal();

  // Dùng useMemo để tạo lại routes khi user thay đổi
  const routes = useMemo(() => {
    if (!currentUser) return staticRoutes;

    // Nếu có user, thêm username vào route profile
    return staticRoutes.map((route) => {
      if (route.path === "/profile") {
        return {
          ...route,
          path: `/profile/${currentUser?.username}`,
        };
      }
      return route;
    });
  }, [currentUser]);

  return (
    <>
      <div className="sticky left-0 top-0 hidden h-screen xs:block xl:p-2">
        <div className="flex h-full flex-col justify-between">
          <div className="mx-1 my-2 flex flex-col gap-2">
            {routes.map((route) => (
              <RouteItem
                key={route.path}
                name={route.name}
                path={route.path}
                icon={route.icon}
              />
            ))}
            <DisplaySettings />
            <RouteCreatePost />
          </div>
          <div className="m-2 space-y-4">
            {/*TODO: Chuyển button sang RouteItem hoặc custom button logout */}

            <Button
              name="Logout"
              className={
                currentUser
                  ? "flex w-full items-center justify-center gap-2 bg-main-background p-2 text-main-primary"
                  : "hidden"
              }
              onClick={logoutModal.openModal}
              label={
                <>
                  <TbLogout size={24} />
                  <p className="hidden xl:block">Logout</p>
                </>
              }
            />
          </div>
        </div>
      </div>
      {logoutModal.open && <ActionLogout modal={logoutModal} />}
    </>
  );
};

export default RouteSidebar;
