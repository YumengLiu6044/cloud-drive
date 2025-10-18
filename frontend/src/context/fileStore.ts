import { DriveApi } from "@/api/driveApi";
import { STORAGE_KEYS } from "@/constants";
import type { Directory, FileStore } from "@/type";
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
				set({trashFiles: newFiles});
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
				const {setTrashFiles} = get();
				DriveApi.listTrashContent()
					.then((res) => {
						const newTrashFiles = res.data?.result ?? [];
						console.log(newTrashFiles)
						setTrashFiles(newTrashFiles)
					})
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
