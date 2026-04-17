import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Picker from "@emoji-mart/react";

import ProgressBar from "./ProgressBar";

import { CiFaceSmile, CiImageOn } from "react-icons/ci";
import Button from "@/components/shared/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "@/app/providers/themeProvider";

const CreatePostActions = ({
  modal,
  verifiedUser,
  textLength,
  imagesLength,
  imgRef,
  handleAddEmoji,
  handleImgChange,
  mutatePending,
}) => {
  const inputLimit = verifiedUser ? 1000 : 350;
  const inputLength = textLength;
  const isCharLimitExceeded = inputLength > inputLimit;

  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiData, setEmojiData] = useState(null);
  const { theme } = useTheme();
  const emojiRef = useRef(null);
  // Sử dụng hook để ẩn Picker khi click ra ngoài
  useOnClickOutside(emojiRef, () => setShowEmoji(false));

  useEffect(() => {
    const fetchEmojiData = async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data",
      );
      const data = await response.json();
      setEmojiData(data);
    };

    fetchEmojiData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowEmoji((prevShowEmoji) => {
        if (prevShowEmoji) {
          return false;
        }
        return prevShowEmoji;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addEmoji = (e) => {
    // Tách các phần của unified
    const codePoints = e.unified.split("-");
    // Chuyển đổi từng phần thành mã code point
    const emoji = String.fromCodePoint(
      ...codePoints.map((code) => parseInt(code, 16)),
    );

    if (isCharLimitExceeded) {
      return toast.error(
        "Input limit reached, please unlock Premium to add more features",
      );
    }
    // Cập nhật văn bản
    handleAddEmoji((prevText) => prevText + emoji);
  };
  return (
    <div className="relative flex justify-between py-2">
      <div className="flex items-center gap-1">
        <span onClick={() => imgRef.current.click()}>
          <CiImageOn className="h-6 w-6 cursor-pointer fill-main-accent/80 hover:fill-main-accent" />
        </span>
        <span onClick={() => (showEmoji ? null : setShowEmoji(!showEmoji))}>
          <CiFaceSmile className="h-6 w-6 cursor-pointer fill-main-accent/80 hover:fill-main-accent" />
        </span>
      </div>
      {showEmoji && (
        <div
          className={twMerge("absolute z-10", modal ? "bottom-0" : "top-0")}
          ref={emojiRef}
        >
          <Picker
            data={emojiData}
            emojiSize={20}
            emojiButtonSize={28}
            onEmojiSelect={addEmoji}
            maxFrequentRows={1}
            theme={theme}
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*,image/gif"
        hidden
        ref={imgRef}
        onChange={handleImgChange}
        multiple
      />
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-4"
          animate={
            inputLength ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
        >
          <ProgressBar
            inputLimit={inputLimit}
            inputLength={inputLength}
            isCharLimitExceeded={isCharLimitExceeded}
          />
        </motion.div>
        <Button
          label={mutatePending ? "Posting..." : "Post"}
          disabled={
            (textLength === 0 && imagesLength === 0) ||
            isCharLimitExceeded ||
            mutatePending
          }
          className={twMerge(
            textLength > 0 || imagesLength > 0
              ? "hover:bg-main-accent/85"
              : "bg-main-accent/50",
          )}
        />
      </div>
    </div>
  );
};

export default CreatePostActions;
