export const SUB_ROUTES = {
	login: "/login",
	register: "/register",
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

export const PASSWORD_MIN_LENGTH = 8;

export const IGNORE_401_ROUTES = [
	"/reset-password",
	"/login",
] as const;
