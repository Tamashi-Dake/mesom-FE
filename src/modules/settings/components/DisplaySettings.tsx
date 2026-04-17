import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import cn from "clsx";
import { Modal } from "@/components/modal/Modal";
import DisplayModal from "./DisplayModal";
import { CiCircleMore } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiCog } from "react-icons/bi";
import { GrCircleInformation } from "react-icons/gr";
import { MdDisplaySettings } from "react-icons/md";
import { useModal } from "@/hooks/useModal";

const variants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.4 },
  },
  exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
};

const DisplaySettingsMenu = () => {
  const displayModal = useModal();

  return (
    <>
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background relative rounded-2xl max-w-xl w-full my-8 overflow-hidden"
        open={displayModal.open}
        closeModal={displayModal.closeModal}
      >
        <DisplayModal closeModal={displayModal.closeModal} />
      </Modal>
      <Menu className="relative" as="div">
        {({ open }) => (
          <>
            <MenuButton className="group relative flex w-full text-main-primary outline-none">
              <div
                className={cn(
                  `custom-button flex w-full items-center justify-center gap-4 text-xl transition group-hover:bg-main-primary/10 group-focus-visible:ring-2 group-focus-visible:ring-[#878a8c] dark:group-hover:bg-main-accent/10 dark:group-focus-visible:ring-white xl:justify-start xl:px-4`,
                  open && "bg-main-primary/10",
                )}
              >
                <CiCircleMore size={24} />
                <p className="hidden xl:block">More</p>
              </div>
            </MenuButton>
            <AnimatePresence>
              {open && (
                <MenuItems
                  anchor="top"
                  className="menu-container absolute -top-44 w-60 bg-main-background font-medium text-main-primary"
                  as={motion.div}
                  {...variants}
                  static
                >
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        className={cn(
                          "flex w-full cursor-not-allowed gap-2 rounded-t-md px-4 py-2 duration-200 hover:bg-main-primary/10",
                          active && "bg-main-sidebar-background",
                        )}
                        href="/settings"
                      >
                        <BiCog size={24} className="text-main-primary" />
                        <p className="text-lg">Settings and privacy</p>
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        className={cn(
                          "flex w-full cursor-not-allowed gap-3 rounded-t-md px-4 py-2 duration-200 hover:bg-main-primary/10",
                          active && "bg-main-sidebar-background",
                        )}
                        href="/about"
                      >
                        <GrCircleInformation
                          size={24}
                          className="text-main-primary"
                        />
                        <p className="text-lg">Help center</p>
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    <Button
                      onClick={displayModal.openModal}
                      className="flex w-full cursor-pointer items-center justify-start gap-3 px-4 py-2 hover:bg-main-primary/10"
                    >
                      <MdDisplaySettings
                        size={24}
                        className="text-main-primary"
                      />
                      <p className="text-lg">Display</p>
                    </Button>
                  </MenuItem>
                </MenuItems>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </>
  );
};

export default DisplaySettingsMenu;
