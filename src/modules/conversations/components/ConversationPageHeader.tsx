import { Button } from "@headlessui/react";

import HeaderWrapper from "@/components/layout/HeaderWrapper";
import MobileSidebar from "@/components/layout/MobileSidebar";

import { MdInfoOutline } from "react-icons/md";

const ConversationPageHeader = ({ name, modal, onClick }) => {
  return (
    <HeaderWrapper classname={" p-0 py-2 border-b-0"}>
      <div className="flex items-center justify-between p-2 px-4">
        <div className="flex items-center gap-2">
          <MobileSidebar />
          <h1 className="text-xl font-semibold leading-none">{name}</h1>
        </div>
        <Button
          className="rounded-full p-1 transition-all ease-in-out hover:bg-main-accent/30 hover:text-white hover:brightness-95"
          onClick={modal?.openModal || onClick}
        >
          <MdInfoOutline className="h-5 w-5" />
        </Button>
      </div>
    </HeaderWrapper>
  );
};

export default ConversationPageHeader;
