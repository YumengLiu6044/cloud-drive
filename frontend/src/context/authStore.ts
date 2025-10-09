import { useAuthStorageKey } from "@/constants";
import type { AuthStore } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSidebarStore } from "./sidebarStore";

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			token: null,
			login: (newToken: string | null) => {
				const {setIsSidebarVisible} = useSidebarStore.getState()
				set({ token: newToken })
				setIsSidebarVisible(true)
			},
			logout: () => {
				const {setIsSidebarVisible} = useSidebarStore.getState()
				setIsSidebarVisible(false)
				setTimeout(() => {
					set({token: null})
				}, 1000)
			}
		}),
		{
			name: useAuthStorageKey,
			partialize: (state) => ({
				token: state.token,
			}),
		}
	)
);

export default useAuthStore;
