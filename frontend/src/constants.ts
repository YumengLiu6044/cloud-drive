import { Clock, Folder, Settings, Trash2 } from "lucide-react";

export const SUB_ROUTES = {
	login: "/login",
	register: "/register",
	loginCallback: "/login-callback",
	resetPassword: "/reset-password",
	drive: {
		base: "/drive",
		files: "/drive/files",
		trash: "/drive/trash",
		settings: "/drive/settings",
		recent: "/drive/recent",
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

export const PASSWORD_MIN_LENGTH = 8;

export const IGNORE_401_ROUTES = ["/reset-password", "/login"] as const;

export const SIDEBAR_ITEMS = [
	{
		name: "Files",
		Icon: Folder,
		route: SUB_ROUTES.drive.files,
	},
	{
		name: "Recent",
		Icon: Clock,
		route: SUB_ROUTES.drive.recent,
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

export const LIST_HEADER_COLS = {
	name: "Name",
	type: "Type",
	last_modified: "Date Added",
	size: "Size",
};
