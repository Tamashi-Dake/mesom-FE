import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { toggleFollow } from "../api";

export const useFollowUser = (userId: string, refetchSingle = false) => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: toggleFollow,
    onSuccess: (data) => {
      const { followers } = data;

      if (!refetchSingle) {
        queryClient.setQueryData(["suggestedUsers"], (existingUsers: any = []) => {
          const suggestedUsers = existingUsers.suggestedUsers;
          suggestedUsers.map((targetUser: any) => {
            if (targetUser._id === userId) {
              return { ...targetUser, followers: followers };
            }
            return targetUser;
          });
        });
      }

      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return followMutation;
};
