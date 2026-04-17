const calculateNextIndex = (
  type: "prev" | "next",
  selectedIndex: number,
  imagesCount: number,
): number => {
  const isPrev = type === "prev";
  const isAtStart = selectedIndex === 0;
  const isAtEnd = selectedIndex === imagesCount - 1;

  if (isPrev) {
    return isAtStart ? imagesCount - 1 : selectedIndex - 1;
  } else {
    return isAtEnd ? 0 : selectedIndex + 1;
  }
};

export default calculateNextIndex;
