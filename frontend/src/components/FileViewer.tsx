import { X } from "lucide-react";
import { useCallback, useState } from "react";
import FileListView from "./FileListView";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import useKeyDown from "@/hooks/useKeyDown";
import { useDeviceType } from "@/hooks/useDeviceType";
import NewFolderButton from "./NewFolderButton";
import type { FileViewerProps } from "@/type";

export default function FileViewer({
	directoryTree,
	files,
	onDoubleClick,
	fileCursorIndex,
	selectedFiles,
	setFileCursorIndex,
	setSelectedFiles,
	onDirectoryClick,
	fileActions,
	renderedList,
	setRenderedList,
}: FileViewerProps) {
	// Screen size
	const { isDesktop } = useDeviceType();

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
		<div className="w-full flex flex-col gap-4 main-section">
			<div className="w-full flex items-center justify-between">
				<div className="flex gap-2 items-center">
					{directoryTree.map((item, index) => (
						<div className="flex gap-2 items-center" key={index}>
							<span
								key={index}
								className="cursor-pointer hover:underline"
								onClick={() => onDirectoryClick(item)}
							>
								{item.name}
							</span>
							{index !== directoryTree.length - 1 && (
								<span>{">"}</span>
							)}
						</div>
					))}
				</div>
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
							{fileActions.map((item, index) => (
								<Button
									variant="outline"
									key={index}
									aria-label={item.label}
									onClick={item.action}
								>
									{item.Icon}
								</Button>
							))}
						</ButtonGroup>
					) : (
						<></>
					)}
				</div>
			</div>

			<div className="relative w-full h-[90%]">
				{!isDesktop && (
					<div className="fixed bottom-5 right-5">
						<NewFolderButton isCollapsed={true}></NewFolderButton>
					</div>
				)}
				<div className="w-full h-full bg-card rounded-2xl border-border">
					<FileListView
						files={files}
						handleRowClick={handleRowClick}
						handleRowDoubleClick={onDoubleClick}
						selectedFiles={selectedFiles}
						fileCursorIndex={fileCursorIndex}
						setFileCursorIndex={setFileCursorIndex}
						setSelectedFiles={setSelectedFiles}
						renderedList={renderedList}
						setRenderedList={setRenderedList}
					/>
				</div>
			</div>
		</div>
	);
}
