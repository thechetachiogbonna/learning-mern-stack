import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  getUser: () => Promise<void>;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  getUser: async () => {

  },
  clearUser: () => set({ user: null }),
}));

export default useUserStore;