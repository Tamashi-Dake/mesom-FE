import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../modal/Modal";
import { twMerge } from "tailwind-merge";
import { Button } from "@headlessui/react";
import { IoCloseSharp } from "react-icons/io5";
import { ToolTip } from "../common/Tooltip";
import { ImageModal } from "../modal/ImageModal";
import calculateNextIndex from "../../helper/caculateNextIndex";

const variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, scale: 0.5 },
  transition: { type: "spring", duration: 0.5 },
};

const ImageView = ({
  previewImage = false,
  isMessage = false,
  imagesCount,
  images,
  removeImage,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const { open, openModal, closeModal } = useModal();
  useEffect(() => {
    const imageData = images[selectedIndex];
    setSelectedImage(previewImage ? imageData?.previewURL : imageData);
  }, [images, previewImage, selectedIndex]);

  const handleSelectedImage = (index) => {
    setSelectedIndex(index);
    openModal();
  };

  const handleNextIndex = (type) => () => {
    const nextIndex = calculateNextIndex(type, selectedIndex, imagesCount);

    setSelectedIndex(nextIndex);
  };

  return (
    <div
      className={twMerge(
        "grid max-h-80 select-none grid-cols-2 grid-rows-2 rounded-2xl xs:h-[37vw] md:h-[271px]",
        !previewImage ? "gap-0.5 overflow-hidden rounded-lg" : "gap-2",
      )}
    >
      <Modal
        modalClassName={twMerge(
          "flex justify-center w-full items-center relative",
        )}
        imageModal
        open={open}
        closeModal={closeModal}
        closePanelOnClick
      >
        <ImageModal
          imageData={selectedImage}
          imagesCount={imagesCount}
          selectedIndex={selectedIndex}
          handleNextIndex={handleNextIndex}
        />
      </Modal>
      <AnimatePresence mode="popLayout">
        {images.map((image, index) => (
          <motion.div
            className={twMerge(
              "accent-tab group relative h-full max-h-80 transition-shadow",
              imagesCount === 1 ? "col-span-2 row-span-2" : "",
              imagesCount === 2 || (index === 0 && imagesCount === 3)
                ? "row-span-2"
                : "",
            )}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition="transition"
            // lấy tối thiểu 20 kí tự cuối do 10 vẫn trùng key được
            key={image.id || image?.slice(-20)}
          >
            <img
              className={twMerge(
                "relative h-full cursor-pointer transition hover:brightness-75 hover:duration-200",
                previewImage && "rounded-2xl",
                imagesCount === 1
                  ? "m-auto w-fit rounded-2xl object-contain"
                  : "w-full object-cover",
                isMessage && "object-cover",
              )}
              src={image.previewURL || image}
              alt={"Post Image"}
              onClick={(e) => {
                e.preventDefault();
                handleSelectedImage(index);
              }}
            />
            {removeImage && (
              <Button
                className="absolute left-0 top-0 translate-x-1 translate-y-1 rounded-full bg-gray-800 p-1 backdrop-blur-sm hover:bg-image-preview-hover/75"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <IoCloseSharp className="h-5 w-5 text-white" />
                <ToolTip className="translate-y-2" tip="Remove" />
              </Button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ImageView;
