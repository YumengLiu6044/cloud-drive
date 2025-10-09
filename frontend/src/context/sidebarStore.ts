import type { SidebarStore } from "@/type";
import { create } from "zustand";

export const useSidebarStore = create<SidebarStore>((set) => ({
	isCollapsed: false,
	setIsCollapsed: (newState: boolean) => set({ isCollapsed: newState }),
}));
