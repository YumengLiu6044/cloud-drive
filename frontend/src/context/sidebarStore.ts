import type { SidebarStore } from "@/type";
import { create } from "zustand";

export const useSidebarStore = create<SidebarStore>((set, get) => ({
	isCollapsed: false,
	toggleIsCollapsed: () => {
		const { isCollapsed } = get();
		set({ isCollapsed: !isCollapsed });
	},

	isSidebarVisible: true,
	setIsSidebarVisible: (newState) => set({ isSidebarVisible: newState }),
}));
