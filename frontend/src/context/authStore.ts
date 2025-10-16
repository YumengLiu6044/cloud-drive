import { STORAGE_KEYS } from "@/constants";
import type { AuthStore } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			token: null,
			username: null,
			email: null,
			driveRootId: null,
			profileImageId: null,

			setUsername: (newUsername: string) =>
				set({ username: newUsername }),
			login: (newToken: string | null) => {
				set({ token: newToken });
			},
			logout: () => {
				set({token: null});
			},
			setEmail(email) {
				set({ email });
			},
			setProfileImageId(newId) {
				set({ profileImageId: newId });
			},
		}),
		{
			name: STORAGE_KEYS.authStore,
			partialize: (state) => ({
				token: state.token,
				username: state.username,
				email: state.email,
				profileImageId: state.profileImageId
			}),
		}
	)
);

export default useAuthStore;
