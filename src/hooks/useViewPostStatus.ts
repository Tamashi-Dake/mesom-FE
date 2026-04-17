import { useParams } from "react-router-dom";

const useViewPostStatus = (postId) => {
  const { postId: postParam } = useParams();
  return {
    inPostPage: !!postParam,
    isViewingPost: postParam === postId,
  };
};

export default useViewPostStatus;
