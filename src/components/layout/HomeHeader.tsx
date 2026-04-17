import { useCurrentUser } from "../../app/providers/authProvider";
import Tab from "../common/Tab";
import Button from "../shared/Button";
import HeaderWrapper from "./HeaderWrapper";
import MobileSidebar from "./MobileSidebar";

const HomeHeader = ({ activeTab, onTabChange }) => {
  const { currentUser } = useCurrentUser();
  const isVerified = currentUser?.verified;
  return (
    <HeaderWrapper classname={"flex justify-between flex-col p-0"}>
      <div className="flex justify-between p-4 pb-2">
        <div className="flex items-center justify-evenly gap-2">
          <MobileSidebar />
          <h1 className="text-xl font-semibold leading-none">Home</h1>
        </div>
        {!isVerified && (
          <Button
            className={"bg-main-accent/40 text-white"}
            label={"Upgrade to Premium"}
            onClick={() => alert("Upgrade to Premium")}
          />
        )}
      </div>

      <div className="flex">
        <Tab
          label="For you"
          isActive={activeTab === "forYou"}
          onClick={() => onTabChange("forYou")}
        />
        <Tab
          label="Following"
          isActive={activeTab === "following"}
          onClick={() => onTabChange("following")}
        />
      </div>
    </HeaderWrapper>
  );
};

export default HomeHeader;
