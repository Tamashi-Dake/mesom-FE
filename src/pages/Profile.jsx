import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// import useFollow from "../../hooks/useFollow";
// import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import useCurrentUser from "../hooks/useCurrentUser";
import { getUserByUsername } from "../services/userService";
import { formatMemberSinceDate } from "../helper/formatDate";

// import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import DefaultHeader from "../components/layout/DefaultHeader";
// import EditProfileModal from "./EditProfileModal";

import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const { username } = useParams();

  const [coverImg, setCoverImg] = useState(null);
  const [avatarImg, setProfileImg] = useState(null);
  const [postType, setPostType] = useState("userPosts"); //userPosts/ userReplies/ userMedias/ userLikes

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  // const { follow, isPending } = useFollow();
  const currentUser = useCurrentUser();

  const {
    data: user,
    isLoading,
    refetch,
    // isError,
    // error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserByUsername(username),
  });

  // const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = currentUser.data._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  // const amIFollowing = currentUser.data?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "avatarImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      {/* TODO: Add case when User not found */}
      {/* Chuyển trang profile cần loading thay vì rerender chậm-còn data từ trang profile trước */}
      {!isLoading && user && (
        <>
          <DefaultHeader
            label={user.displayName || user.username}
            additionalContent="0 post"
            showBackArrow
          />
          {/* COVER IMG */}
          <div className="relative group/cover">
            <img
              src={user?.profile.coverImg || "https://placehold.co/1000x1000"}
              className="h-52 w-full object-cover"
              alt="cover image"
            />
            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              accept="image/*"
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "avatarImg")}
            />
            {/* USER AVATAR */}
            <div className="avatarImg absolute -bottom-16 left-4">
              <div className="w-32 rounded-full relative group/avatarImg">
                <img
                  src={
                    avatarImg ||
                    user?.profile.avatarImg ||
                    "https://placehold.co/1000x1000"
                  }
                />
                <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatarImg:opacity-100 opacity-0 cursor-pointer">
                  {isMyProfile && (
                    <MdEdit
                      className="w-4 h-4 text-white"
                      onClick={() => profileImgRef.current.click()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end px-4 mt-5">
            {/* {isMyProfile && userProfile={currentUser.data} />} */}
            {/* {!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => follow(user?._id)}
									>
										{isPending && "Loading..."}
										{!isPending && amIFollowing && "Unfollow"}
										{!isPending && !amIFollowing && "Follow"}
									</button>
								)} */}
            {(coverImg || avatarImg) && (
              <button
                className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                // onClick={async () => {
                //   await updateProfile({ coverImg, avatarImg });
                //   setProfileImg(null);
                //   setCoverImg(null);
                // }}
              >
                {/* {isUpdatingProfile ? "Updating..." : "Update"} */}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-14 px-4">
            <div className="flex flex-col">
              <span className="font-bold text-lg">
                {user?.displayName || user.username}
              </span>
              <span className="text-sm text-slate-500">@{user?.username}</span>
              <span className="text-sm my-1">{user?.bio}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 items-center ">
                <FaLink className="w-3 h-3 text-slate-500" />
                <a
                  href="https://youtube.com/@dake8921"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {user?.link || "Link"}
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500">
                  {memberSinceDate}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">
                  {user?.following.length}
                </span>
                <span className="text-slate-500 text-xs">Following</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">
                  {user?.followers.length}
                </span>
                <span className="text-slate-500 text-xs">Followers</span>
              </div>
            </div>
          </div>
          <div className="flex w-full border-b border-gray-700 mt-4">
            <div
              className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
              onClick={() => setPostType("posts")}
            >
              Posts
              {postType === "posts" && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
              )}
            </div>
            <div
              className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
              onClick={() => setPostType("likes")}
            >
              Likes
              {postType === "likes" && (
                <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Profile;
