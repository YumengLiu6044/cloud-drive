import { Clock, Folder, Settings, Trash2 } from "lucide-react";
import type { MockFile } from "./type";

export const SUB_ROUTES = {
	login: "/login",
	register: "/register",
	resetPassword: "/reset-password",
	drive: {
		base: "/drive",
		files: "/drive/files",
		trash: "/drive/trash",
		settings: "/drive/settings",
		recent: "/drive/recent",
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

export const mockFiles: MockFile[] = [
	{
		id: 1,
		name: "Documents",
		type: "folder",
		size: null,
		modified: "2 days ago",
		owner: "You",
	},
	{
		id: 2,
		name: "Photos",
		type: "folder",
		size: null,
		modified: "1 week ago",
		owner: "You",
	},
	{
		id: 3,
		name: "Project Proposal.pdf",
		type: "file",
		size: "2.4 MB",
		modified: "Yesterday",
		owner: "You",
		fileType: "pdf",
	},
	{
		id: 4,
		name: "Presentation.pptx",
		type: "file",
		size: "5.1 MB",
		modified: "3 days ago",
		owner: "You",
		fileType: "presentation",
	},
	{
		id: 5,
		name: "Budget 2024.xlsx",
		type: "file",
		size: "890 KB",
		modified: "1 week ago",
		owner: "You",
		fileType: "spreadsheet",
	},
	{
		id: 6,
		name: "Meeting Notes.docx",
		type: "file",
		size: "124 KB",
		modified: "2 weeks ago",
		owner: "You",
		fileType: "document",
	},
	{
		id: 7,
		name: "Design Assets",
		type: "folder",
		size: null,
		modified: "3 days ago",
		owner: "You",
	},
	{
		id: 8,
		name: "hero-image.png",
		type: "file",
		size: "3.2 MB",
		modified: "5 days ago",
		owner: "You",
		fileType: "image",
	},
] as const;

export const LIST_HEADER_COLS = {
	name: "Name",
	type: "Type",
	modified: "Date Added",
	size: "Size",
};
