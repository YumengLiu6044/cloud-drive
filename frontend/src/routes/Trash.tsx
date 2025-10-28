import { DriveApi } from "@/api/driveApi";
import FileViewer from "@/components/FileViewer";
import { useFileStore } from "@/context/fileStore";
import type { Resource } from "@/type";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Trash() {
	const trashFiles = useFileStore((state) => state.trashFiles);
	const [renderedList, setRenderedList] = useState(trashFiles);
	const { refreshTrash } = useFileStore.getState();

	useEffect(() => {
		refreshTrash();
	}, []);

	// File state variables
	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const handleDelete = useCallback(() => {
		if (isLoadingDelete) return;
		
		const selectedIDs: string[] = [];
		for (const index of selectedFiles) {
			selectedIDs.push(renderedList[index]._id);
		}

		setIsLoadingDelete(true);
		const promise = DriveApi.deleteFromTrash(selectedIDs)
			.then(() => {
				setFileCursorIndex(-1);
				setSelectedFiles(new Set());
				refreshTrash();
			})
			.finally(() => setIsLoadingDelete(false));

		toast.promise(promise, {
			loading: "Permanently deleting files from trash...",
			success: `Permanently deleted files from trash`,
			error: "Failed to permanently delete files from trash",
		});
	}, [
		selectedFiles,
		renderedList,
		isLoadingDelete,
	]);

	const handleRowDoubleClick = () => {};

	const fileActions = useMemo(() => {
		return [
			{
				Icon: <ArchiveRestore></ArchiveRestore>,
				label: "Restore Files",
				action: () => {},
			},
			{
				Icon: <Trash2></Trash2>,
				label: "Permanently Remove Trash",
				action: handleDelete,
			},
		];
	}, [handleDelete]);

	return (
		<FileViewer
			isTrash={true}
			onDirectoryClick={() => {}}
			onDoubleClick={(_: Resource) => {}}
			files={trashFiles}
			directoryTree={[{ name: "Trash", id: "" }]}
			fileCursorIndex={fileCursorIndex}
			setFileCursorIndex={setFileCursorIndex}
			setSelectedFiles={setSelectedFiles}
			selectedFiles={selectedFiles}
			fileActions={fileActions}
			renderedList={renderedList}
			setRenderedList={setRenderedList}
		></FileViewer>
	);
}
