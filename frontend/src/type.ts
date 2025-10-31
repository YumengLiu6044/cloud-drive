import type { Dispatch, ReactNode, SetStateAction } from "react";

export type AuthStore = {
	token: string | null;
	login: (_: string | null) => void;
	logout: () => void;

	username: string | null;
	setUsername: (_: string) => void;

	email: string | null;
	setEmail: (_: string) => void;

	profileImageId: string | null;
	setProfileImageId: (_: string) => void;
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
	last_modified: number;
	owner: string;
	type: string;
};

export interface FileListRowProps {
	item: Resource;
	isSelected: boolean;
	isActive: boolean;
	isDragging: boolean;
	isTrash: boolean;
	onClick: () => void;
	handleRowDoubleClick: (_: Resource) => void;
}

export interface FileListViewProps {
	selectedFiles: Set<number>;
	setSelectedFiles: Dispatch<SetStateAction<Set<number>>>;
	fileCursorIndex: number;
	setFileCursorIndex: Dispatch<SetStateAction<number>>;

	isTrash: boolean;
	
	handleRowClick: (_: number) => void;
	handleRowDoubleClick: (_: Resource) => void;
	files: Resource[];
	renderedList: Resource[];
	setRenderedList: Dispatch<SetStateAction<Resource[]>>;
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
};

export type FileStore = {
	files: Resource[];
	setFiles: (newFiles: Resource[]) => void;

	rootDirectory: Directory | null;
	setRootDirectory: (newDirectory: Directory | null) => void;

	directoryTree: Directory[];
	setDirectoryTree: (newDirectories: Directory[]) => void;

	trashFiles: Resource[];
	setTrashFiles: (newFiles: Resource[]) => void;

	draggedItem: Resource | null;
	setDraggedItem: (newItems: Resource | null) => void;

	isDraggingFiles: boolean;
	setIsDraggingFiles: (isDragging: boolean) => void;

	draggingItemIds: string[];
	setDraggingItemIds: (newIds: string[]) => void;

	isLoadingDelete: boolean;
	setIsLoadingDelete: (isLoading: boolean) => void;

	// Util functions
	resetState: () => void;
	refreshFiles: () => void;
	refreshTrash: () => void;
	changeDirectory: (newDirectory: Directory) => void;
	handleMoveToTrash: (ids: string[]) => void;
};

export interface NewFolderButtonProps {
	isCollapsed: boolean;
}

export type ListHeader = {
	id: keyof Resource;
	label: string;
	sortOrder?: string | null;
};

export interface FileViewerProps {
	files: Resource[];
	renderedList: Resource[];
	setRenderedList: Dispatch<SetStateAction<Resource[]>>;
	directoryTree: Directory[];
	onDoubleClick: (_: Resource) => void;

	isTrash: boolean;

	selectedFiles: Set<number>;
	setSelectedFiles: Dispatch<SetStateAction<Set<number>>>;
	fileCursorIndex: number;
	setFileCursorIndex: Dispatch<SetStateAction<number>>;

	onDirectoryClick: (_: Directory) => void;

	fileActions: {
		action: () => void;
		Icon: ReactNode;
		label: string;
	}[];
}

export interface DroppableProps {
	id: string;
	children: ReactNode;
	className?: string;
	isOverClassName?: string;
	accepts?: string;
}
