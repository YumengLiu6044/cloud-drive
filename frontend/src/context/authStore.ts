import { useAuthStorageKey } from "@/constants";
import type { AuthStore } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			token: null,
			login: (newToken: string | null) => {
				set({ token: newToken });
			},
			logout: () => {
				set({ token: null });
			},
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
