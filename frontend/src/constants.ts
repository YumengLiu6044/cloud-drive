export const SUB_ROUTES = {
	login: "/login",
	resetPassword: "/reset-password",
	drive: {
		base: "/drive",
		dashboard: "/drive/dashboard",
		files: "/drive/files",
		trash: "/drive/trash",
	},
	settings: "/settings",
} as const;
export const AUTH_API_BASE = "/auth";
export const useAuthStorageKey = "auth-store";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;