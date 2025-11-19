import { STORAGE_KEYS } from "@/constants";
import type { AuthStore } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useFileStore } from "./fileStore";

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			token: null,
			username: null,
			email: null,
			profileImageId: null,
			googleProfileURL: null,

			setUsername: (newUsername: string) =>
				set({ username: newUsername }),
			login: (newToken: string | null) => {
				set({ token: newToken });
			},
			logout: () => {
				const { resetState } =
					useFileStore.getState();
				resetState()
				set({ 
					token: null,
					username: null,
					email: null,
					profileImageId: null
				 });
			},
			setEmail(email) {
				set({ email });
			},
			setProfileImageId(newId) {
				set({ profileImageId: newId });
			},
			setGoogleProfileURL(newURL) {
				set({ googleProfileURL: newURL})
			},
		}),
		{
			name: STORAGE_KEYS.authStore,
			partialize: (state) => ({
				token: state.token,
				username: state.username,
				email: state.email,
				profileImageId: state.profileImageId,
				googleProfileURL: state.googleProfileURL
			}),
		}
	)
);

export default useAuthStore;
