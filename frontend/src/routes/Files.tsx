import FileViewer from "@/components/FileViewer";
import { useFileStore } from "@/context/fileStore";
import type { Resource } from "@/type";
import { Copy, Download, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Files() {
	const files = useFileStore((state) => state.files);
	const [renderedList, setRenderedList] = useState(files);

	const directoryTree = useFileStore((state) => state.directoryTree);
	const { changeDirectory, refreshFiles, handleMoveToTrash } =
		useFileStore.getState();

	useEffect(() => {
		refreshFiles();
	}, [directoryTree]);

	// File state variables
	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	useEffect(() => {
		setSelectedFiles(new Set());
		setFileCursorIndex(-1);
	}, [files])

	const handleRowDoubleClick = useCallback((file: Resource) => {
		// Only handle folder double clicks
		if (file.is_folder) {
			// Reset selections
			setSelectedFiles(new Set());
			setFileCursorIndex(-1);

			changeDirectory({ name: file.name, id: file._id });
		}
	}, []);

	const moveToTrash = useCallback(() => {
		const selectedIDs: string[] = [];
		for (const index of selectedFiles) {
			selectedIDs.push(renderedList[index]._id);
		}
		handleMoveToTrash(selectedIDs);
	}, [selectedFiles, renderedList, handleMoveToTrash]);

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
				action: moveToTrash,
			},
		];
	}, [moveToTrash]);

	return (
		<FileViewer
			isTrash={false}
			onDirectoryClick={changeDirectory}
			files={files}
			directoryTree={directoryTree}
			onDoubleClick={handleRowDoubleClick}
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
