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
			driveRootId: null,

			setUsername: (newUsername: string) =>
				set({ username: newUsername }),
			login: (newToken: string | null) => {
				set({ token: newToken });
			},
			logout: () => {
				const { setFiles, setCurrentDirectory, setRootDirectory } =
					useFileStore.getState();

				setFiles([]);
				setCurrentDirectory(null);
				setRootDirectory(null);

				set({ token: null });
			},
			setEmail(email) {
				set({ email });
			},
		}),
		{
			name: STORAGE_KEYS.authStore,
			partialize: (state) => ({
				token: state.token,
				username: state.username,
				email: state.email,
			}),
		}
	)
);

export default useAuthStore;
