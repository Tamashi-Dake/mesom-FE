import { formatDate } from "@/utils/formatDate";

import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";

const ProfileInfo = ({ user }) => {
  const memberSinceDate = formatDate(user?.createdAt, "user");

  return (
    <div className="mt-4 flex flex-col gap-4 px-4 text-main-primary">
      <div className="flex flex-col">
        <span className="truncate whitespace-pre-line break-all text-lg font-bold">
          {user?.displayName || user.username}
        </span>
        <span className="text-sm text-slate-500">@{user?.username}</span>
        <span className="my-1 truncate whitespace-pre-line break-all text-sm text-main-secondary">
          {user?.profile.bio}
        </span>
      </div>

      {/* TODO: Add missing user fields */}
      <div className="flex flex-wrap gap-2">
        {user?.profile.website && (
          <div className="flex items-center gap-2">
            <FaLink className="h-4 w-4 shrink-0 text-slate-500" />
            <a
              href={
                user?.profile?.website?.includes("http")
                  ? user?.profile.website
                  : `https://${user?.profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="truncate whitespace-pre-line break-all text-sm text-main-accent hover:underline"
            >
              {user?.profile.website || ""}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <IoCalendarOutline className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-500">
            Joined {memberSinceDate}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold">{user?.following.length}</span>
          <span className="text-xs text-slate-500">Following</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold">{user?.followers.length}</span>
          <span className="text-xs text-slate-500">Followers</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
