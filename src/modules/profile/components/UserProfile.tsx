import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useModal } from "@/hooks/useModal";
import { updateUser } from "../api";

import DefaultHeader from "@/components/layout/DefaultHeader";
import UpdateUserModal from "./UpdateUserModal";
import Button from "@/components/shared/Button";
import FollowButton from "@/components/shared/FollowButton";
import ProfileImages from "./ProfileImages";
import ProfileInfo from "./ProfileInfo";

const UserProfile = ({ userQuery, isMyProfile }) => {
  const queryClient = useQueryClient();
  const { data: user } = userQuery;
  const updateUserModal = useModal();

  const userMutate = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Updated successfully");

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      {user ? (
        <>
          <DefaultHeader
            label={user.displayName || user.username}
            showBackArrow
          />

          <ProfileImages
            avatarImg={user?.profile.avatarImg}
            coverImg={user?.profile.coverImg}
          />

          <div className="mt-4 flex justify-end px-4">
            {isMyProfile ? (
              <Button
                label={"Edit profile"}
                disabled={
                  updateUserModal.open ||
                  userMutate.isLoading ||
                  userMutate.isPending
                }
                onClick={updateUserModal.openModal}
              />
            ) : (
              <FollowButton userId={user._id} />
            )}
          </div>

          {updateUserModal.open && (
            <UpdateUserModal
              modal={updateUserModal}
              user={user}
              userMutate={userMutate}
            />
          )}

          <ProfileInfo user={user} />
        </>
      ) : (
        <>
          <DefaultHeader label={"User not found"} showBackArrow />
        </>
      )}
    </>
  );
};
export default UserProfile;
