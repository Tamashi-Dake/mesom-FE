import { BiCog } from "react-icons/bi";
import Tab from "@/components/common/Tab";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import MobileSidebar from "@/components/layout/MobileSidebar";

const NotificationHeader = ({ activeTab, onTabChange }) => {
  return (
    <HeaderWrapper classname={"flex justify-between flex-col p-0"}>
      <div className="flex justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <h1 className="text-xl font-semibold leading-none">Notifications</h1>
        </div>
        <button
          onClick={() => alert("open menu: Setting, delete all(premium)")}
        >
          <BiCog />
        </button>
      </div>

      <div className="flex">
        <Tab
          label="All"
          isActive={activeTab === "allNotifications"}
          onClick={() => onTabChange("allNotifications")}
        />
        <Tab
          label="Mentions"
          isActive={activeTab === "mentions"}
          onClick={() => onTabChange("mentions")}
        />
      </div>
    </HeaderWrapper>
  );
};

export default NotificationHeader;
