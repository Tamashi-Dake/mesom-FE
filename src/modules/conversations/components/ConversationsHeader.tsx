import { Button } from "@headlessui/react";

import HeaderWrapper from "@/components/layout/HeaderWrapper";

import { HiOutlineCog8Tooth } from "react-icons/hi2";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { TbMessagePlus } from "react-icons/tb";

const ConversationsHeader = ({ modal }) => {
  return (
    <HeaderWrapper classname={" p-0 py-2 border-b-0"}>
      <div className="flex items-center justify-between p-2 px-4">
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <h1 className="text-xl font-semibold leading-none">Conversation</h1>
        </div>
        <div className="flex gap-2">
          <Button
            className="rounded-full p-1 transition-all ease-in-out hover:bg-main-accent/80 hover:text-white hover:brightness-95"
            onClick={() => alert("Open Conversation settings - WIP")}
          >
            <HiOutlineCog8Tooth className="h-5 w-5" />
          </Button>
          <Button
            className="rounded-full p-1 transition-all ease-in-out hover:bg-main-accent/80 hover:text-white hover:brightness-95"
            onClick={modal?.openModal}
          >
            <TbMessagePlus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default ConversationsHeader;
