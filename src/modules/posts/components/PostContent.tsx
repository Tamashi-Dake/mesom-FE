import { twMerge } from "tailwind-merge";
import { useEffect, useRef, useState } from "react";
import { Button } from "@headlessui/react";
import ImageView from "@/components/shared/ImageView";

const PostContent = ({ textContent, images }) => {
  const [readMore, setReadMore] = useState(false);

  const [showReadMoreButton, setShowReadMoreButton] = useState(false);

  const textRef = useRef(null);
  useEffect(() => {
    if (textRef.current) {
      setShowReadMoreButton(
        textRef.current.scrollHeight !== textRef.current.clientHeight,
      );
    }
  }, []);

  const handleReadMore = (e) => {
    e.preventDefault();
    setReadMore(!readMore);
  };

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      <span
        ref={textRef}
        className={twMerge(
          `truncate whitespace-pre-line break-all font-thin`,
          readMore ? "line-clamp-none" : "line-clamp-3",
        )}
      >
        {textContent}
      </span>
      {showReadMoreButton && (
        <Button
          // onDragStart={(event) => {
          //   event.preventDefault();
          //   event.stopPropagation();
          // }}
          onClick={handleReadMore}
          className="w-fit rounded-lg bg-main-primary/10 px-4 py-2 text-sm font-semibold hover:bg-main-primary/20"
        >
          {readMore ? "Show less" : "Show more"}
        </Button>
      )}

      {images.length > 0 && (
        <ImageView images={images} imagesCount={images.length} />
      )}
    </div>
  );
};

export default PostContent;
