import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";
import cn from "clsx";

import { backdropVariant, modalVariant } from "../shared/config";
import { AiOutlineClose } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

export const Modal = ({
  open,
  children,
  className,
  modalAnimation,
  modalClassName,
  closePanelOnClick,
  closeModal,
  imageModal = false,
  actionModal = false,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          className="relative z-50"
          open={open}
          onClose={closeModal}
          static
        >
          <motion.div
            className="hover-animation fixed inset-0 bg-black/40 dark:bg-[#5B7083]/40"
            aria-hidden="true"
            {...backdropVariant}
          />
          <div
            className={cn(
              "fixed inset-0 overflow-y-auto p-4",
              className ?? "flex items-center justify-center",
            )}
          >
            <DialogPanel
              className={modalClassName}
              as={motion.div}
              {...(modalAnimation ?? modalVariant)}
              onClick={closePanelOnClick ? closeModal : undefined}
            >
              {!(imageModal || actionModal) && (
                <motion.button
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.2,
                  }}
                  className={twMerge(
                    "absolute right-0 top-0 ml-auto border-0 p-4 text-main-primary transition hover:opacity-70",
                  )}
                  onClick={closeModal}
                >
                  <AiOutlineClose size={20} />
                </motion.button>
              )}
              {children}
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
