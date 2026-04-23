import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCurrentUser, login, register, logout } from "./api";

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      queryClient.setQueryData(["authUser"], data?.user ?? data);
      navigate("/");
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success("Account created successfully");
      if (data?.user) {
        queryClient.setQueryData(["authUser"], data.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.clear();
      navigate("/auth");
    },
  });
};
