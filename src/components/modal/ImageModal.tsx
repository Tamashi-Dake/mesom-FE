import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { backdropVariant, modalVariant } from "../shared/config";
import { Button } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import LoadingSpinner from "../common/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

const arrowButtons = [
  ["prev", null, <FaArrowLeft key={"arrow"} className="h-6 w-6" />],
  ["next", "order-1", <FaArrowRight key={"arrow"} className="h-6 w-6" />],
];

export const ImageModal = ({
  tweet,
  imageData,
  imagesCount,
  selectedIndex,
  handleNextIndex,
}) => {
  const [indexes, setIndexes] = useState([]);
  // const [loading, setLoading] = useState(true);

  const fetchImage = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return url;
  };

  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["image", imageData],
    queryFn: () => fetchImage(imageData),
    enabled: !!imageData, // chỉ fetch khi imageData không phải là null/undefined
    staleTime: 1000 * 60 * 5, // cache trong 5 phút
  });

  const requireArrows = handleNextIndex && imagesCount > 1;

  useEffect(() => {
    if (
      tweet &&
      selectedIndex !== undefined &&
      !indexes.includes(selectedIndex)
    ) {
      // setLoading(true);
      setIndexes([...indexes, selectedIndex]);
    }

    const media = new Image();

    media.src = imageUrl;

    // const handleLoadingCompleted = () => setLoading(false);

    // media.onload = handleLoadingCompleted;
  }, [...(tweet && imagesCount > 1 ? [imageUrl] : [])]);

  useEffect(() => {
    if (!requireArrows) return;

    const handleKeyDown = ({ key }) => {
      const callback =
        key === "ArrowLeft"
          ? handleNextIndex("prev")
          : key === "ArrowRight"
            ? handleNextIndex("next")
            : null;

      if (callback) callback();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleNextIndex]);

  return (
    <>
      {requireArrows &&
        arrowButtons.map(([name, className, icon]) => (
          <Button
            className={twMerge(
              `absolute z-10 text-main-accent hover:bg-light-primary/10 active:bg-light-primary/20 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20`,
              name === "prev" ? "left-2" : "right-2",
              className,
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleNextIndex(name)();
            }}
            key={name}
          >
            {icon}
          </Button>
        ))}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            className="mx-auto"
            {...backdropVariant}
            exit={tweet ? backdropVariant.exit : undefined}
            transition={{ duration: 0.15 }}
          >
            <LoadingSpinner className="h-20 w-20" />
          </motion.div>
        ) : (
          <motion.div
            className="relative mx-auto"
            {...modalVariant}
            key={imageUrl}
          >
            <picture className="group relative flex max-w-3xl">
              <source srcSet={imageUrl} type="image/*" />
              <img
                className="max-h-[75vh] rounded-md object-contain md:max-h-[80vh]"
                src={imageUrl}
                alt={"PostImage"}
              />
              {/* <a
                className="trim-alt accent-tab absolute bottom-0 right-0 mx-2 mb-2 translate-y-4
                             rounded-md bg-main-background/40 px-2 py-1 text-sm text-light-primary/80 opacity-0
                             transition hover:bg-main-accent hover:text-white focus-visible:translate-y-0
                             focus-visible:bg-main-accent focus-visible:text-white focus-visible:opacity-100
                             group-hover:translate-y-0 group-hover:opacity-100 dark:text-dark-primary/80"
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open original
              </a> */}
            </picture>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
