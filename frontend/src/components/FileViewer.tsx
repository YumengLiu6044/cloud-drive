import { Download, Layout, List, Trash2, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCallback, useState } from "react";
import FileListView from "./FileListView";
import FileGridView from "./FileGridView";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import useKeyCombo from "@/hooks/useKeyCombo";
import useKeyDown from "@/hooks/useKeyDown";
import { useFileStore } from "@/context/fileStore";

export default function FileViewer() {
	const [selectedTabValue, setSelectedTabValue] = useState("list");
	const handleToggleValueChange = useCallback((value: string) => {
		if (!value) return;
		setSelectedTabValue(value);
	}, []);

	// File state variables
	const { files } = useFileStore();
	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	// ----------------- Keyboard event interception ---------------------
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

	// All selection / removal
	const handleRemoveAllSelected = () => {
		setSelectedFiles(new Set());
		setFileCursorIndex(-1);
	};
	const handleSelectedAll = useCallback(() => {
		if (selectedFiles.size === files.length) {
			setSelectedFiles(new Set());
		} else {
			setSelectedFiles(new Set(files.map((_, index) => index)));
		}
	}, [files, selectedFiles]);
	useKeyCombo({ key: "a", ctrl: true }, handleSelectedAll);
	useKeyCombo({ key: "a", meta: true }, handleSelectedAll);

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

			if (shiftDownIndex === -1) {
				const newSet = new Set<number>().add(clickedIndex);
				setSelectedFiles(newSet);
			} else {
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
		},
		[shiftDownIndex]
	);

	return (
		<div
			className="w-full flex flex-col gap-4"
			onMouseDown={(e) => e.preventDefault()}
		>
			<div className="w-full h-fit px-5 md:px-10 py-[10px] bg-card flex items-center justify-between border-b">
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
							<Button variant="outline">
								<Download></Download>
							</Button>
							<Button variant="outline">
								<Trash2></Trash2>
							</Button>
						</ButtonGroup>
					) : (
						<></>
					)}

					<ToggleGroup
						variant="outline"
						type="single"
						defaultValue="list"
						value={selectedTabValue}
						onValueChange={handleToggleValueChange}
					>
						<ToggleGroupItem
							value="list"
							aria-label="Toggle list view"
						>
							<List></List>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="grid"
							aria-label="Toggle grid view"
						>
							<Layout></Layout>
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>

			<div className="w-full px-5 md:px-10">
				<div className="w-full h-[80vh] bg-card rounded-2xl border-border">
					{selectedTabValue === "list" ? (
						<FileListView
							handleRowClick={handleRowClick}
							selectedFiles={selectedFiles}
							fileCursorIndex={fileCursorIndex}
						/>
					) : (
						<FileGridView />
					)}
				</div>
			</div>
		</div>
	);
}
