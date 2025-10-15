import { Copy, Download, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FileListView from "./FileListView";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import useKeyDown from "@/hooks/useKeyDown";
import { useFileStore } from "@/context/fileStore";

export default function FileViewer() {
	// File state variables
	const files = useFileStore((state) => state.files);
	const currentDirectory = useFileStore((state) => state.currentDirectory);
	const {refreshFiles} = useFileStore.getState()

	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	useEffect(() => {
		refreshFiles()
	}, []);

	// ----------------- Keyboard event interception ---------------------
	// Shift status
	const [shiftDownIndex, setShiftDownIndex] = useState(-1);
	const handleShiftDown = useCallback(() => {
		if (fileCursorIndex !== -1) {
			setShiftDownIndex(fileCursorIndex);
			setSelectedFiles(new Set<number>().add(fileCursorIndex));
		}
	}, [fileCursorIndex]);
	const handleShiftUp = useCallback(() => {
		setShiftDownIndex(-1);
	}, []);
	useKeyDown("Shift", handleShiftDown, handleShiftUp);

	// Control key status
	const [isControlPressed, setIsControlPressed] = useState(false);
	useKeyDown(
		"Control",
		() => setIsControlPressed(true),
		() => setIsControlPressed(false)
	);
	const [isMetaPressed, setIsMetaPressed] = useState(false);
	useKeyDown(
		"Meta",
		() => setIsMetaPressed(true),
		() => setIsMetaPressed(false)
	);

	// All selection / removal
	const handleRemoveAllSelected = () => {
		setSelectedFiles(new Set());
		setFileCursorIndex(-1);
	};
	const handleSelectedAll = useCallback(() => {
		if (!isControlPressed && !isMetaPressed) return;

		// Clear selections
		if (selectedFiles.size === files.length) {
			setSelectedFiles(new Set());
		}
		// Selected all
		else {
			setSelectedFiles(new Set(files.map((_, index) => index)));
		}
	}, [files, selectedFiles, isControlPressed, isMetaPressed]);
	useKeyDown("a", handleSelectedAll, () => {});

	// Arrow down handling
	const handleArrowDown = useCallback(() => {
		// No shift
		if (shiftDownIndex === -1) {
			setFileCursorIndex((prev) => {
				if (prev === -1) return prev;
				const newIndex = Math.min(files.length - 1, prev + 1);
				setSelectedFiles(new Set<number>().add(newIndex));
				return newIndex;
			});
		}
		// Shifted
		else {
			setFileCursorIndex((prev) => {
				if (prev === -1) return prev;
				const newIndex = prev + 1;
				if (newIndex >= files.length) return prev;
				if (newIndex > shiftDownIndex) {
					setSelectedFiles((prev) =>
						new Set<number>(prev).add(newIndex)
					);
				} else if (newIndex <= shiftDownIndex) {
					setSelectedFiles((prevFiles) => {
						const newSet = new Set(prevFiles);
						newSet.delete(prev);
						return newSet;
					});
				}
				return newIndex;
			});
		}
	}, [shiftDownIndex, files]);
	useKeyDown("ArrowDown", handleArrowDown, () => {});

	// Arrow up handling
	const handleArrowUp = useCallback(() => {
		// Unshifted
		if (shiftDownIndex === -1) {
			setFileCursorIndex((prev) => {
				if (prev === -1) return prev;
				const newIndex = Math.max(0, prev - 1);
				setSelectedFiles(new Set<number>().add(newIndex));
				return newIndex;
			});
		}
		// Shifted
		else {
			setFileCursorIndex((prev) => {
				if (prev === -1) return prev;
				const newIndex = prev - 1;
				if (newIndex < 0) return prev;

				if (newIndex >= shiftDownIndex) {
					setSelectedFiles((prevFiles) => {
						const newSet = new Set(prevFiles);
						newSet.delete(prev);
						return newSet;
					});
				} else {
					setSelectedFiles((prev) =>
						new Set<number>(prev).add(newIndex)
					);
				}
				return newIndex;
			});
		}
	}, [shiftDownIndex]);
	useKeyDown("ArrowUp", handleArrowUp, () => {});

	// Handle row click
	const handleRowClick = useCallback(
		(clickedIndex: number) => {
			// Move the cursor
			setFileCursorIndex(clickedIndex);

			// Handle control / meta + click
			if (isControlPressed || isMetaPressed) {
				setSelectedFiles((prev) => {
					const newSet = new Set(prev);

					if (prev.has(clickedIndex)) {
						newSet.delete(clickedIndex);
					} else {
						newSet.add(clickedIndex);
					}
					return newSet;
				});
			}
			// Handle shift + click
			else if (shiftDownIndex !== -1) {
				if (clickedIndex === shiftDownIndex) return;
				const newSet = new Set<number>();
				for (
					let i = Math.min(shiftDownIndex, clickedIndex);
					i <= Math.max(shiftDownIndex, clickedIndex);
					i++
				) {
					newSet.add(i);
				}
				setSelectedFiles(newSet);
			}
			// Handle default click
			else {
				const newSet = new Set<number>().add(clickedIndex);
				setSelectedFiles(newSet);
			}
		},
		[shiftDownIndex, isControlPressed, isMetaPressed]
	);

	return (
		<div
			className="w-full flex flex-col gap-4"
			onMouseDown={(e) => e.preventDefault()}
		>
			<div className="w-full px-5 md:px-10 py-[10px] bg-card flex items-center justify-between border-b">
				<h2>My Drive</h2>
				<div className="flex items-center gap-5">
					{selectedFiles.size ? (
						<ButtonGroup className="">
							<Button
								variant="outline"
								onClick={handleRemoveAllSelected}
							>
								<X></X>
								{selectedFiles.size} selected
							</Button>
							<Button variant="outline" aria-label="Copy files">
								<Copy></Copy>
							</Button>
							<Button
								variant="outline"
								aria-label="Download files"
							>
								<Download></Download>
							</Button>
							<Button
								variant="outline"
								aria-label="Move to trash"
							>
								<Trash2></Trash2>
							</Button>
						</ButtonGroup>
					) : (
						<></>
					)}
				</div>
			</div>

			<div className="w-full px-5 md:px-10">
				<div className="w-full h-[80vh] bg-card rounded-2xl border-border">
					<FileListView
						handleRowClick={handleRowClick}
						selectedFiles={selectedFiles}
						fileCursorIndex={fileCursorIndex}
					/>
				</div>
			</div>
		</div>
	);
}
