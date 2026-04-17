import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getPost, getRepliesForPost } from "../api";

import useInfiniteScroll from "@/hooks/useInfiniteScroll";

import { SEO } from "@/components/common/SEO";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DefaultHeader from "@/components/layout/DefaultHeader";
import CreatePost from "../components/CreatePost";
import AuthorAvatar from "../components/AuthorAvatar";
import Post from "../components/Post";
import PostInfo from "../components/PostInfo";
import PostOptions from "../components/PostOptions";
import PostContent from "../components/PostContent";
import PostActions from "../components/PostActions";
import PostStatus from "../components/PostStatus";
import PostDate from "../components/PostDate";

const PostPage = () => {
  const { postId } = useParams();

  // TODO: Like không cập nhật khi mở nhiều tabs
  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: errorPost,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
  });

  const { data: parentPost } = useQuery({
    queryKey: ["post", post?.parent?.parentPostID],
    queryFn: () => getPost(post?.parent?.parentPostID),
    enabled: !!post?.parent?.parentPostID,
  });

  const {
    data: replies,
    isFetchingNextPage,
    ref,
  } = useInfiniteScroll(
    ["post", postId, "reply"],
    ({ pageParam = 0 }) =>
      getRepliesForPost({ postId: postId, skip: pageParam }),
    (lastPage) => lastPage.nextSkip || undefined,
  );
  return (
    <>
      <SEO
        title={`${post?.author.displayName || post?.author.username} on Mesom: "${post?.text ?? ""}`}
      />
      <DefaultHeader label="Post" showBackArrow />
      <main>
        {isPostLoading && <div>Loading...</div>}
        {isPostError && <div>Error: {errorPost.message}</div>}

        {parentPost &&
          (!parentPost?.deleted ? (
            <Link
              to={`/post/${parentPost?._id}`}
              className="flex flex-1 items-start gap-2 p-4 text-main-primary transition-all hover:bg-main-primary/10"
            >
              <AuthorAvatar author={parentPost.author} isReply />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <PostInfo
                    author={parentPost.author}
                    createDate={parentPost.createdAt}
                    postId={parentPost._id}
                  />
                  <PostOptions
                    authorId={parentPost.author._id}
                    authorName={parentPost.author.username}
                    postId={parentPost._id}
                    postParam={postId}
                  />
                </div>
                <PostContent
                  textContent={parentPost.text}
                  images={parentPost.images}
                />
                <PostActions post={parentPost} />
              </div>
            </Link>
          ) : (
            <div className="border-b border-light-border dark:border-dark-border">
              <h4 className="m-4 rounded-2xl bg-neutral-100 px-4 py-2 text-base font-light text-gray-500">
                This post was deleted by the author.
              </h4>
            </div>
          ))}

        {post &&
          (!post?.deleted ? (
            <>
              <div className="flex flex-1 items-start gap-2 border-b border-light-border p-4 text-main-primary transition-all dark:border-dark-border">
                <AuthorAvatar author={post.author} />

                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <PostInfo
                      author={post.author}
                      createDate={post.createdAt}
                      postId={post._id}
                    />
                    <PostOptions
                      authorId={post.author._id}
                      authorName={post.author.username}
                      postId={post._id}
                      postParam={postId}
                    />
                  </div>
                  {parentPost && (
                    <p className="text-sm text-main-secondary">
                      Replying to{" "}
                      <Link
                        to={`/user/${parentPost?.author?.username}`}
                        className="custom-underline text-main-accent"
                      >
                        @{parentPost?.author?.username}
                      </Link>
                    </p>
                  )}
                  <PostContent textContent={post.text} images={post.images} />
                  <div className="flex items-center gap-1">
                    <PostDate createdAt={post.createdAt} />
                    <span>·</span>
                    <span className="text-sm text-main-secondary">
                      {post.views} {post.views > 1 ? "views" : "view"}
                    </span>
                  </div>
                  <PostStatus
                    totalReplies={post.userReplies}
                    userLikes={post.userLikes}
                    userShares={post.userShared}
                  />
                  <PostActions post={post} />
                </div>
              </div>
              <CreatePost
                postId={postId}
                isReply
                authorName={post?.author?.username}
                modal
              />
              {!replies?.pages[0]?.message &&
                replies?.pages.map((replyPageInfo) =>
                  replyPageInfo.posts.map((reply, index) => {
                    const isPostBeforeLastPost =
                      index === replyPageInfo.posts.length - 1;
                    return (
                      <Post
                        innerRef={isPostBeforeLastPost ? ref : null}
                        key={reply._id}
                        post={reply}
                        queryType={[postId, "reply"]}
                        postParam={postId}
                      />
                    );
                  }),
                )}
              {isFetchingNextPage && <LoadingSpinner />}
            </>
          ) : (
            <div className="text-center">
              <h4 className="m-4 rounded-2xl px-4 py-2 text-base font-light text-gray-500">
                Post not found.
              </h4>
            </div>
          ))}
      </main>
    </>
  );
};

export default PostPage;
