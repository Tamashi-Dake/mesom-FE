import { useEffect } from "react";

const useClickOutside = (domNodeRef, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (domNodeRef.current && !domNodeRef.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [domNodeRef, handler]);
};

export default useClickOutside;
