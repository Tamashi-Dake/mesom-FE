import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import { twMerge } from "tailwind-merge";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { useCurrentUser } from "./lib/context/authContext";

import { config } from "./components/shared/config";
import FameSidebar from "./components/layout/FameSidebar";
import RouteSidebar from "./components/layout/RouteSidebar";
import RouteBottomBar from "./components/layout/RouteBottombar";
import FloatButton from "./components/shared/FloatButton";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { SEO } from "./components/common/SEO";

import "./App.css";

function App() {
  const inBigScreen = useMediaQuery("(min-width: 1000px)");
  const { currentUser, isLoadingCurrentUser } = useCurrentUser();

  const navigate = useNavigate();
  let location = useLocation();

  const { title, icon } = config[location.pathname] || config["/"];
  const inConversation = location.pathname.includes("/conversation");

  useEffect(() => {
    if (!isLoadingCurrentUser && !currentUser) {
      // console.log(currentUser);
      navigate("/auth");
    }
  }, [isLoadingCurrentUser, currentUser, navigate]);

  if (isLoadingCurrentUser) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO
        title="Mesom"
        description="This is Mesom, where you join discussions about the latest news."
      />
      <div className="xl:px-30 container mx-auto h-full bg-main-background md:max-w-7xl">
        <div
          className={twMerge(
            "grid h-full w-full grid-cols-none grid-rows-[1fr,auto] xs:grid-rows-1 xl:grid-cols-[1fr,1fr,1fr,1fr]",
            inBigScreen
              ? "xs:grid-cols-[minmax(auto,4rem),1fr,1fr,1fr]"
              : "xs:grid-cols-[minmax(auto,5rem),1fr]",
          )}
        >
          <RouteSidebar />
          <div
            // Invalid: can't see the last post
            className={twMerge(
              "relative w-full overflow-hidden border-light-border dark:border-dark-border xs:border-x-[1px]",
              inBigScreen ? "col-span-2" : "",
            )}
          >
            <Outlet />
            {/* Hack: overflow might add weird space or cut some page contents and i don't have time to think about this sh */}
            {!inConversation && (
              <div className="block h-12 bg-transparent xs:hidden"></div>
            )}
          </div>
          <FameSidebar />
          {!inConversation && (
            <>
              <RouteBottomBar />
              {/* TODO: 2 chức năng: create post, và link đến conversations khi ở trong profile */}
              <FloatButton title={title} icon={icon} />
            </>
          )}
        </div>
      </div>
      <SpeedInsights />
    </>
  );
}

export default App;
