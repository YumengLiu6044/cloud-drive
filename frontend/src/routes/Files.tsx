import { DriveApi } from "@/api/driveApi";
import FileViewer from "@/components/FileViewer";
import { useFileStore } from "@/context/fileStore";
import type { Resource } from "@/type";
import { Copy, Download, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Files() {
	const files = useFileStore((state) => state.files);
	const directoryTree = useFileStore((state) => state.directoryTree);
	const { changeDirectory, refreshFiles } = useFileStore.getState();

	useEffect(() => {
		refreshFiles();
	}, [directoryTree]);

	// File state variables
	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const handleDelete = useCallback(() => {
		if (isLoadingDelete) return;

		const selectedIDs: string[] = [];
		for (const index of selectedFiles) {
			selectedIDs.push(files[index]._id);
		}

		setIsLoadingDelete(true);
		const promise = DriveApi.moveToTrash(selectedIDs)
			.then(() => {
				setFileCursorIndex(-1);
				setSelectedFiles(new Set());
				refreshFiles();
			})
			.finally(() => setIsLoadingDelete(false));

		toast.promise(promise, {
			loading: "Loading",
			success: `Moved files to trash`,
			error: "Failed to move files to trash",
		});
	}, [selectedFiles, files, isLoadingDelete]);

	const handleRowDoubleClick = useCallback((file: Resource) => {
		// Only handle folder double clicks
		if (file.is_folder) {
			// Reset selections
			setSelectedFiles(new Set());
			setFileCursorIndex(-1);

			changeDirectory({ name: file.name, id: file._id });
		}
	}, []);

	const fileActions = useMemo(() => {
		return [
			{
				Icon: <Copy></Copy>,
				label: "Copy Files",
				action: () => {},
			},
			{
				Icon: <Download></Download>,
				label: "Download Files",
				action: () => {},
			},
			{
				Icon: <Trash2></Trash2>,
				label: "Move files to trash",
				action: handleDelete,
			},
		];
	}, [handleDelete]);

	return (
		<FileViewer
			onDirectoryClick={changeDirectory}
			files={files}
			directoryTree={directoryTree}
			onDoubleClick={handleRowDoubleClick}
			fileCursorIndex={fileCursorIndex}
			setFileCursorIndex={setFileCursorIndex}
			setSelectedFiles={setSelectedFiles}
			selectedFiles={selectedFiles}
			fileActions={fileActions}
		></FileViewer>
	);
}
