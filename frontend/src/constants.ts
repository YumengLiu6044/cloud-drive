import { Folder, Settings, Trash2 } from "lucide-react";

export const SUB_ROUTES = {
	login: "/login",
	register: "/register",
	resetPassword: "/reset-password",
	drive: {
		base: "/drive",
		files: "/drive/files",
		trash: "/drive/trash",
		settings: "/drive/settings",
	},
} as const;
export const AUTH_API_BASE = "/auth";
export const useAuthStorageKey = "auth-store";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const PASSWORD_MIN_LENGTH = 8;

export const IGNORE_401_ROUTES = ["/reset-password", "/login"] as const;

export const SIDEBAR_ITEMS = [
	{
		name: "Files",
		Icon: Folder,
		route: SUB_ROUTES.drive.files,
	},
	{
		name: "Trash",
		Icon: Trash2,
		route: SUB_ROUTES.drive.trash,
	},
	{
		name: "Settings",
		Icon: Settings,
		route: SUB_ROUTES.drive.settings,
	},
];
