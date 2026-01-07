import { fetchCurrentUser } from "@/lib/api";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  getUser: () => Promise<User | null>;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  getUser: async () => {
    try {
      const data = await fetchCurrentUser();
      set({ user: data as unknown as User });
      return data as unknown as User;
    } catch {
      set({ user: null });
      return null;
    }
  },
  clearUser: () => set({ user: null }),
}));

export default useUserStore;