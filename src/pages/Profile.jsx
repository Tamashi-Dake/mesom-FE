import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getUserByUsername } from "../services/userService";
import {
  getLikesByUser,
  getMediasByUser,
  getPostsByUser,
  getRepliesByUser,
} from "../services/postsService";

import Tab from "../components/common/Tab";
import UserProfile from "../components/profile/UserProfile";
import Post from "../components/post/Post";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import LoadingSpinner from "../components/common/LoadingSpinner";
import getMessageForTab from "../helper/getMessageForTab";
import { SEO } from "../components/common/SEO";
import { useCurrentUser } from "../lib/context/authContext";

const Profile = () => {
  const { username } = useParams();
  const { currentUser } = useCurrentUser();

  const [postType, setPostType] = useState("userPosts");
  // const [pageTitle, setPageTitle] = useState("userPosts");

  const userQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserByUsername(username),
  });
  const userId = userQuery.data?._id;
  const isMyProfile = currentUser?._id === userId;
  const currentTabMessage = getMessageForTab(postType, isMyProfile, username);
  let pageTitle = "";

  const { data, isFetchingNextPage, ref, refetch } = useInfiniteScroll(
    ["posts", postType],
    ({ pageParam = 0 }) => {
      if (!userId) return;
      switch (postType) {
        case "userPosts":
          return getPostsByUser({ userId: userId, skip: pageParam });
        case "userReplies":
          return getRepliesByUser({ userId: userId, skip: pageParam });
        case "userMedias":
          return getMediasByUser({ userId: userId, skip: pageParam });
        case "userLikes":
          return getLikesByUser({ userId: userId, skip: pageParam });
      }
    },
    (lastPage) => lastPage?.nextSkip || undefined,
    { enabled: !!userId && !userQuery.isLoading },
  );

  if (postType === "userPosts") {
    pageTitle = `${userQuery.data?.displayName} (${userQuery.data?.username}) on Mesom`;
  } else if (postType === "userReplies") {
    pageTitle = `Replies by ${userQuery.data?.displayName} (${userQuery.data?.username}) on Mesom`;
  } else if (postType === "userMedias") {
    pageTitle = `Medias by ${userQuery.data?.displayName} (${userQuery.data?.username}) on Mesom`;
  } else if (postType === "userLikes") {
    pageTitle = `Likes by ${userQuery.data?.displayName} (${userQuery.data?.username}) on Mesom`;
  }

  useEffect(() => {
    userQuery?.refetch();
  }, [username]);

  useEffect(() => {
    refetch();
  }, [userId, postType]);
  if (userQuery.isLoading) return <LoadingSpinner />;
  return (
    <>
      <SEO title={pageTitle} />
      <UserProfile userQuery={userQuery} isMyProfile={isMyProfile} />

      {userId && (
        <div className="flex border-b-[1px] border-light-border text-main-primary dark:border-dark-border">
          <Tab
            label="Posts"
            isActive={postType === "userPosts"}
            onClick={() => setPostType("userPosts")}
          />
          <Tab
            label="Replies"
            isActive={postType === "userReplies"}
            onClick={() => setPostType("userReplies")}
          />
          <Tab
            label="Media"
            isActive={postType === "userMedias"}
            onClick={() => setPostType("userMedias")}
          />
          <Tab
            label="Likes"
            isActive={postType === "userLikes"}
            onClick={() => setPostType("userLikes")}
          />
        </div>
      )}
      {data?.pages[0]?.message ? (
        <section className="mt-0.5 flex justify-center p-8">
          <div className="flex max-w-sm flex-col items-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-3xl font-extrabold text-main-primary">
                {currentTabMessage.title}
              </p>
              <p className="text-main-secondary">
                {currentTabMessage.description}
              </p>
            </div>
          </div>
        </section>
      ) : (
        data?.pages.map((postPageInfo) =>
          postPageInfo?.posts.map((post, index) => {
            const isPostBeforeLastPost =
              index === postPageInfo.posts.length - 1;
            return (
              <Post
                innerRef={isPostBeforeLastPost ? ref : null}
                key={post._id}
                post={post}
                queryType={postType}
              />
            );
          }),
        )
      )}
      {isFetchingNextPage && <LoadingSpinner />}
    </>
  );
};
export default Profile;
