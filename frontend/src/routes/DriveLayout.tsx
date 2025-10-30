import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { SIDEBAR_ITEMS } from "@/constants";
import { useFileStore } from "@/context/fileStore";
import {
	DndContext,
	pointerWithin,
	type DragEndEvent,
	type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback } from "react";
import { Outlet } from "react-router-dom";

export default function DriveLayout() {
	const { setDraggedItem, setIsDraggingFiles, handleMoveToTrash } = useFileStore.getState();
	const draggingIds = useFileStore((state) => state.draggingItemIds);

	const handleDragStart = useCallback((event: DragStartEvent) => {
		setDraggedItem(event.active?.data?.current?.item);
		setIsDraggingFiles(true);
	}, []);
	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const overId = event.over?.id;
		switch (overId) {
			case SIDEBAR_ITEMS.trash.name:
				handleMoveToTrash(draggingIds);
				break;
			case SIDEBAR_ITEMS.files.name:
				console.log("Dropped on Files");
				break;
			default:
				break;

		}

		setDraggedItem(null);
		setIsDraggingFiles(false);
	}, [draggingIds]);

	return (
		<ProtectedRoute>
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
				<div className="flex h-full">
					{/* Sidebar */}
					<Sidebar></Sidebar>

					{/* Content area */}
					<main className="w-full h-full">
						<Topbar></Topbar>
						<Outlet />
					</main>
				</div>
			</DndContext>
		</ProtectedRoute>
	);
}
