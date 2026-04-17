import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import UserTooltip from "@/components/shared/UserTooltip";
import { twMerge } from "tailwind-merge";

const PostInfo = ({ author, createDate, postId, inModal }) => {
  const date = formatDate(createDate, "post");
  const { postId: postParam } = useParams();
  const navigate = useNavigate();

  const isViewingPost = postParam === postId;
  return (
    <div className="flex items-center gap-2">
      <div
        onClick={(e) => {
          e.preventDefault();
          navigate(`/profile/${author.username}`);
        }}
      >
        <UserTooltip user={author} inPost inModal={inModal}>
          <div className="flex flex-col">
            <span
              className={twMerge(
                "truncate whitespace-pre-line break-words font-bold hover:underline",
                inModal ? "max-h-5 max-w-40 overflow-hidden" : "",
              )}
            >
              {author.displayName || author.username}
            </span>
            {isViewingPost && (
              <span className="truncate whitespace-pre-line break-words text-sm text-main-secondary">
                @{author.username}
              </span>
            )}
          </div>
        </UserTooltip>
      </div>
      {!isViewingPost && (
        <div className="flex gap-1 text-sm text-main-secondary">
          <UserTooltip user={author} inPost>
            <div
              onClick={() => navigate(`/profile/${author.username}`)}
              className="truncate whitespace-pre-line break-words"
            >
              @{author.username}
            </div>
          </UserTooltip>

          <>
            <span>·</span>
            <span>{date}</span>
          </>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
