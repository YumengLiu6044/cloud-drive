import FileViewer from "@/components/FileViewer";
import { useFileStore } from "@/context/fileStore";
import type { Resource } from "@/type";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Trash() {
	const trashFiles = useFileStore((state) => state.trashFiles);
	const { refreshTrash } = useFileStore.getState();

	useEffect(() => {
		refreshTrash();
	}, []);

	// File state variables
	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const handleDelete = useCallback(() => {}, [
		selectedFiles,
		trashFiles,
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
			onDirectoryClick={() => {}}
			onDoubleClick={(_: Resource) => {}}
			files={trashFiles}
			directoryTree={[{ name: "Trash", id: "" }]}
			fileCursorIndex={fileCursorIndex}
			setFileCursorIndex={setFileCursorIndex}
			setSelectedFiles={setSelectedFiles}
			selectedFiles={selectedFiles}
			fileActions={fileActions}
		></FileViewer>
	);
}
