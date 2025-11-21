import { Folder, Settings, Trash2 } from "lucide-react";
import type { ListHeader } from "./type";

export const SUB_ROUTES = {
	login: "/login",
	register: "/register",
	loginCallback: "/login-callback",
	googleCallback: "/google-callback",
	resetPassword: "/reset-password",
	drive: {
		base: "/drive",
		files: "/drive/files",
		trash: "/drive/trash",
		settings: "/drive/settings",
	},
} as const;

export const API_BASE = {
	auth: "/auth",
	user: "/user",
	drive: "/drive",
};
export const STORAGE_KEYS = {
	authStore: "auth_store",
	fileStore: "file_store"
};

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const GOOGLE_LOGIN_URL = BACKEND_URL + "/google-auth/login";

export const PASSWORD_MIN_LENGTH = 8;

export const IGNORE_401_ROUTES = ["/reset-password", "/login"] as const;

export const SIDEBAR_ITEMS = {
	files: {
		name: "Files",
		Icon: Folder,
		route: SUB_ROUTES.drive.files,
		accepts: "Trash",
	},
	trash: {
		name: "Trash",
		Icon: Trash2,
		route: SUB_ROUTES.drive.trash,
		accepts: "Files",
	},
	settings: {
		name: "Settings",
		Icon: Settings,
		route: SUB_ROUTES.drive.settings,
		accepts: "",
	},
};

export const TAILWIND_BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
} as const;

export const DEVICE_TYPES = {
	mobile: "mobile",
	tablet: "tablet",
	desktop: "desktop",
} as const;

export const LIST_HEADER_COLS: ListHeader[] = [
	{
		id: "name",
		label: "Name",
	},
	{
		id: "type",
		label: "Type",
	},
	{
		id: "last_modified",
		label: "Date Added",
	},
	{
		id: "size",
		label: "Size",
	},
] as const;

export const GOOGLE_ICON_URL = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png?20221007124453";