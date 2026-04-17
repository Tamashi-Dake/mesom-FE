import { Link, useNavigate } from "react-router-dom";
import UserTooltip from "@/components/shared/UserTooltip";

const AuthorAvatar = ({ author, isReply = false, inModal }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 self-stretch">
      <div
        onClick={(e) => {
          e.preventDefault();
          navigate(`/profile/${author?.username}`);
        }}
      >
        <UserTooltip user={author} inPost inModal={inModal}>
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover"
              src={author?.profile?.avatarImg || "/placeholder.png"}
            />
          </div>
        </UserTooltip>
      </div>
      {isReply && (
        <div className="reply-line-wrapper flex flex-1 justify-center">
          <div className="reply-line border-[1px] border-light-border dark:border-dark-border"></div>
        </div>
      )}
    </div>
  );
};

export default AuthorAvatar;
