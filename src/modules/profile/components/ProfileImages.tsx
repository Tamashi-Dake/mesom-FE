import { twMerge } from "tailwind-merge";

const ProfileImages = ({ avatarImg, coverImg, inUserTooltip }) => {
  return (
    <div className="group/cover relative">
      <img
        src={coverImg || "/placeholder.png"}
        className={twMerge(
          "w-full object-cover",
          inUserTooltip ? "h-20" : "h-52",
        )}
        alt="cover image"
      />
      <div
        className={twMerge(
          "avatarImg absolute",
          inUserTooltip ? "-bottom-8 left-2" : "-bottom-16 left-4",
        )}
      >
        <div
          className={twMerge(
            "group/avatarImg relative rounded-full border-4 border-main-background",
            inUserTooltip ? "h-20 w-20" : "h-32 w-32",
          )}
        >
          <img
            className="h-full w-full rounded-full object-cover"
            src={avatarImg || "/placeholder.png"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImages;
