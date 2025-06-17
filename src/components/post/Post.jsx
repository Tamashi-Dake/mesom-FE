import AuthorAvatar from "./AuthorAvatar";
import PostInfo from "./PostInfo";
import PostOptions from "./PostOptions";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const Post = ({
  post,
  author,
  queryType,
  inReplyModal,
  innerRef,
  postParam,
}) => {
  const isReply = !!post.parent;
  const authorName = post?.parent?.authorName;
  // console.log("rerender post", post.text);
  return (
    <Link
      ref={innerRef}
      to={`/post/${post?._id}`}
      className={twMerge(
        "flex flex-1 items-start gap-2 px-4 py-3 text-main-primary transition-all ease-in-out hover:cursor-pointer",
        inReplyModal
          ? ""
          : "border-b border-light-border dark:border-dark-border",
      )}
    >
      <AuthorAvatar
        author={author || post.author}
        isReply={inReplyModal}
        inModal={inReplyModal}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <PostInfo
            author={author || post.author}
            createDate={post.createdAt}
            postId={post._id}
            inModal={inReplyModal}
          />
          {!inReplyModal && (
            <PostOptions
              authorId={author?._id || post.author._id}
              authorName={author?.username || post.author.username}
              postId={post._id}
              postParam={postParam}
              queryType={queryType}
            />
          )}
        </div>
        {isReply && (
          <p className="text-sm text-main-secondary">
            Replying to{" "}
            <Link
              to={`/user/${authorName}`}
              className="custom-underline text-main-accent"
            >
              @{authorName}
            </Link>
          </p>
        )}
        <PostContent textContent={post.text} images={post.images} />
        {queryType && queryType !== "mentions" && (
          <PostActions post={post} queryType={queryType} />
        )}
        {inReplyModal && (
          <div className="reply-hint mt-2 flex gap-1">
            <span className="text-neutral-500">Replying to</span>
            {/* TODO: Add accent color */}
            <Link
              to={`/profile/${post.author.username}`}
              className="text-main-accent"
            >
              @{post.author.username}
            </Link>
          </div>
        )}
      </div>
    </Link>
  );
};
export default Post;
