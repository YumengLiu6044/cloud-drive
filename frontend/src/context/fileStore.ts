import { DriveApi } from "@/api/driveApi";
import { STORAGE_KEYS } from "@/constants";
import type { Directory, FileStore } from "@/type";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFileStore = create<FileStore>()(
	persist(
		(set, get) => ({
			files: [],
			setFiles(newFiles) {
				set({
					files: newFiles,
				});
			},

			rootDirectory: null,
			setRootDirectory(newDirectory) {
				set({
					rootDirectory: newDirectory,
				});
			},

			directoryTree: [],
			setDirectoryTree: (newDirectories: Directory[]) =>
				set({ directoryTree: newDirectories }),

			trashFiles: [],
			setTrashFiles(newFiles) {
				set({ trashFiles: newFiles });
			},

			draggedItem: null,
			setDraggedItem(newItem) {
				set({ draggedItem: newItem });
			},

			isDraggingFiles: false,
			setIsDraggingFiles(isDragging) {
				set({ isDraggingFiles: isDragging });
			},

			draggingItemIds: [],
			setDraggingItemIds(newIds) {
				set({ draggingItemIds: newIds });
			},

			isLoadingDelete: false,
			setIsLoadingDelete(isLoading) {
				set({ isLoadingDelete: isLoading });
			},

			resetState: () => {
				set({
					files: [],
					trashFiles: [],
					directoryTree: [],
					rootDirectory: null,
				});
			},

			refreshFiles() {
				const { directoryTree } = get();
				const currentDirectory = directoryTree.at(-1);
				if (!currentDirectory) return;

				DriveApi.listContent(currentDirectory.id).then((response) => {
					set({ files: response.data.result ?? [] });
				});
			},

			refreshTrash() {
				const { setTrashFiles } = get();
				DriveApi.listTrashContent().then((res) => {
					const newTrashFiles = res.data?.result ?? [];
					setTrashFiles(newTrashFiles);
				});
			},

			changeDirectory(newDirectory) {
				const { directoryTree, setDirectoryTree } = get();
				const directoryIndex = directoryTree.findIndex(
					(item) => item.id === newDirectory.id
				);

				// Going up the directory tree
				if (directoryIndex !== -1) {
					setDirectoryTree(
						directoryTree.slice(0, directoryIndex + 1)
					);
				}
				// Going down in the directory tree
				else {
					setDirectoryTree([...directoryTree, newDirectory]);
				}
			},

			handleMoveToTrash(ids: string[]) {
				const { setIsLoadingDelete, isLoadingDelete, refreshFiles } =
					get();
				if (isLoadingDelete || !ids.length) return;

				setIsLoadingDelete(true);
				const promise = DriveApi.moveToTrash(ids)
					.then(refreshFiles)
					.finally(() => setIsLoadingDelete(false));

				toast.promise(promise, {
					loading: "Moving files to trash...",
					success: `Moved files to trash`,
					error: "Failed to move files to trash",
				});
			},

			handleMoveFiles(newParentId: string) {
				const { draggingItemIds, refreshFiles } = get();
				if (!draggingItemIds.length) return;

				const promise = DriveApi.moveDirectory(
					draggingItemIds,
					newParentId
				).then(refreshFiles);

				toast.promise(promise, {
					loading: "Moving files...",
					success: `Moved files successfully`,
					error: "Failed to move files",
				});
			},
			handleFileDownload(ids) {
				const promise = DriveApi.downloadFiles(ids);
				toast.promise(promise, {
					loading: "Downloading files...",
					success: `Downloaded files successfully`,
					error: "Failed to download files",
				});
			},
		}),
		{
			name: STORAGE_KEYS.fileStore,
			partialize: (state) => ({
				files: state.files,
				rootDirectory: state.rootDirectory,
				directoryTree: state.directoryTree,
			}),
		}
	)
);
