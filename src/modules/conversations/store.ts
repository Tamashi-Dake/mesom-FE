import toast from "react-hot-toast";
import { create } from "zustand";

interface AddUserState {
  users: { _id: string; username: string; displayName?: string; avatarImg?: string }[];
  setUsers: (newUsers: AddUserState["users"]) => void;
  addUser: (
    user: { _id: string; username: string; displayName?: string; avatarImg?: string },
    verified?: boolean,
  ) => void;
  removeUser: (userId: string) => void;
  resetUsers: () => void;
}

const useAddUserStore = create<AddUserState>((set) => ({
  users: [],
  setUsers: (newUsers) => set({ users: newUsers }),
  addUser: (user, verified) =>
    set((state) => {
      const maxUsers = verified ? 10 : 5;
      const maxLimitMessage = verified
        ? "Max limit for verified user reached."
        : "Max limit for free user reached.";
      const userExists = state.users.some(
        (existingUser) => existingUser._id === user._id,
      );

      if (userExists) {
        return state;
      }
      if (state.users.length < maxUsers) {
        return {
          users: [...state.users, { _id: user._id, username: user.username }],
        };
      }
      toast.error(maxLimitMessage);
      return state;
    }),
  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user._id !== userId),
    })),
  resetUsers: () => set({ users: [] }),
}));

export default useAddUserStore;
