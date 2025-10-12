export type AuthStore = {
	token: string | null;
	login: (_: string | null) => void;
	logout: () => void;
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

export type MockFile = {
	id: number;
	name: string;
	type: string;
	size: string | null;
	modified: string;
	owner: string;
	fileType?: string | null;
};

export interface FileListRowProps {
	item: MockFile;
	isSelected: boolean;
	isActive: boolean;
	onClick: () => void
}

export interface FileListViewProps {
	selectedFiles: Set<number>;
	fileCursorIndex: number;
	handleRowClick: (_: number) => void
}

export type KeyCombo = {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	meta?: boolean;
};