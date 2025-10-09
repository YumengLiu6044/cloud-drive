export type AuthStore = {
	token: string | null;
	login: (_: string | null) => void;
	logout: () => void
};

export type JWTPayload = {
	sub: string;
	exp: number;
	scope: string;
};

export type SidebarStore = {
	isCollapsed: boolean;
	toggleIsCollapsed: () => void;

	isSidebarVisible: boolean;
	setIsSidebarVisible: (_: boolean) => void
};

export interface CustomNode {
  className?: string
  children?: React.ReactNode
}
