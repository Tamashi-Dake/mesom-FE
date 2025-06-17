import { create } from "zustand";

const useCurrentUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useCurrentUserStore;
