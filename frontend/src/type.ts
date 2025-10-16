export type AuthStore = {
	token: string | null;
	login: (_: string | null) => void;
	logout: () => void;

	username: string | null;
	setUsername: (_: string) => void;

	email: string | null;
	setEmail: (_: string) => void;
};

export type JWTPayload = {
	sub: string;
	exp: number;
	scope: string;
};

export type SidebarStore = {
	isCollapsed: boolean;
	toggleIsCollapsed: () => void;
};

export interface CustomNode {
	className?: string;
	children?: React.ReactNode;
}

export type Resource = {
	_id: string;
	name: string;
	is_folder: string;
	size: string | null;
	last_modified: string;
	owner: string;
	type: string
};

export interface FileListRowProps {
	item: Resource;
	isSelected: boolean;
	isActive: boolean;
	onClick: () => void;
}

export interface FileListViewProps {
	selectedFiles: Set<number>;
	fileCursorIndex: number;
	handleRowClick: (_: number) => void;
}

export type KeyCombo = {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	meta?: boolean;
};

export type Directory = {
	id: string;
	name: string;
}

export type FileStore = {
	files: Resource[];
	setFiles: (newFiles: Resource[]) => void;

	currentDirectory: Directory | null;
	setCurrentDirectory: (newDirectory: Directory | null) => void;

	rootDirectory: Directory | null;
	setRootDirectory: (newDirectory: Directory | null) => void;

	refreshFiles: () => void
};

export interface NewFolderButtonProps {
	isCollapsed: boolean;
}
