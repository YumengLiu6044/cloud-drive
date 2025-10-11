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
	id: string;
	name: string;
	type: string;
	size: string | null;
	modified: string;
	owner: string;
	fileType?: string | null;
};
