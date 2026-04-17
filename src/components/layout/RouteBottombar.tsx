import { useMemo } from "react";
import { routes as staticRoutes } from "../shared/config";

import RouteItem from "../shared/RouteItem";
import { useCurrentUser } from "../../app/providers/authProvider";

const RouteBottomBar = () => {
  const { currentUser } = useCurrentUser();

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
    // <div className="sticky bottom-0 col-span-4 border-t-[1px] border-neutral-200 bg-white/60 backdrop-blur-xl xs:hidden">
    //   <div className="flex justify-between sm:m-1 sm:space-y-1 [&>*:nth-child(6)]:hidden">
    <div className="fixed bottom-0 flex w-screen overflow-hidden border-t-[1px] border-light-border bg-main-background dark:border-dark-border xs:hidden">
      <div className="m-1 flex w-full justify-between space-y-1 [&>*:nth-child(6)]:hidden">
        {routes.map((route) => (
          <RouteItem
            key={route.path}
            name={route.name}
            path={route.path}
            icon={route.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default RouteBottomBar;
