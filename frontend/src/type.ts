export type AuthStore = {
	token: string | null;
	setToken: (_: string | null) => void;
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
  className?: string
  children?: React.ReactNode
}
