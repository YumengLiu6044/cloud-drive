import type { AuthStore } from "@/type";
import {create} from "zustand"

const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  setToken: (newToken: string | null) => set({token: newToken})
}))

export default useAuthStore;