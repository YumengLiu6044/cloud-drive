import { DriveApi } from "@/api/driveApi";
import { STORAGE_KEYS } from "@/constants";
import type { FileStore, Resource } from "@/type";
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

			currentDirectory: null,
			setCurrentDirectory(newDirectory) {
				set({
					currentDirectory: newDirectory,
				});
			},

			rootDirectory: null,
			setRootDirectory(newDirectory) {
				set({
					rootDirectory: newDirectory,
				});
			},

			refreshFiles() {
				const { currentDirectory } = get();
				if (!currentDirectory) return;

				DriveApi.listContent(currentDirectory.id).then((response) => {
					const files: Resource[] = response.data.result ?? [];
					console.log(files)
					set({
						files: files,
					});
				});
			},
		}),
		{
			name: STORAGE_KEYS.fileStore,
			partialize: (state) => ({
				files: state.files,
				currentDirectory: state.currentDirectory,
				rootDirectory: state.rootDirectory,
			}),
		}
	)
);
