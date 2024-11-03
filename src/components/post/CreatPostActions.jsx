import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Picker from "@emoji-mart/react";

import ProgressBar from "./ProgressBar";

import { CiFaceSmile, CiImageOn } from "react-icons/ci";
import Button from "../shared/Button";
import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const CreatePostActions = ({
  modal,
  verifiedUser,
  textLength,
  imagesLength,
  imgRef,
  handleAddEmoji,
  handleImgChange,
  mutatePening,
}) => {
  const inputLimit = verifiedUser ? 1000 : 350;
  const inputLength = textLength;
  const isCharLimitExceeded = inputLength > inputLimit;

  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiData, setEmojiData] = useState(null);
  const emojiRef = useRef(null);
  // Sử dụng hook để ẩn Picker khi click ra ngoài
  useOnClickOutside(emojiRef, () => setShowEmoji(false));

  useEffect(() => {
    const fetchEmojiData = async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
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
      ...codePoints.map((code) => parseInt(code, 16))
    );

    if (isCharLimitExceeded) {
      return toast.error(
        "Input limit reached, please unlock Premium to add more features"
      );
    }
    // Cập nhật văn bản
    handleAddEmoji((prevText) => prevText + emoji);
  };
  return (
    <div className="flex justify-between relative py-2 ">
      <div className="flex gap-1 items-center">
        <span onClick={() => imgRef.current.click()}>
          <CiImageOn className="fill-blue-500 hover:fill-blue-400 w-5 h-5 cursor-pointer" />
        </span>
        <span onClick={() => (showEmoji ? null : setShowEmoji(!showEmoji))}>
          <CiFaceSmile className="fill-blue-500 hover:fill-blue-400 w-5 h-5 cursor-pointer" />
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
            theme={"light"}
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
          label={mutatePening ? "Posting..." : "Post"}
          disabled={
            (textLength === 0 && imagesLength === 0) || isCharLimitExceeded
          }
          className={twMerge(
            textLength > 0 || imagesLength > 0
              ? " hover:bg-sky-500/85"
              : "bg-sky-500/50 "
          )}
        />
      </div>
    </div>
  );
};

export default CreatePostActions;