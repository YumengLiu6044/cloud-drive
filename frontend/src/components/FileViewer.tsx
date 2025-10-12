import { Download, Layout, List, Trash2, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCallback, useState } from "react";
import FileListView from "./FileListView";
import FileGridView from "./FileGridView";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { mockFiles } from "@/constants";
import useKeyCombo from "@/hooks/useKeyCombo";
import useKeyDown from "@/hooks/useKeyDown";

export default function FileViewer() {
	const [selectedTabValue, setSelectedTabValue] = useState("list");
	const handleToggleValueChange = useCallback((value: string) => {
		if (!value) return;
		setSelectedTabValue(value);
	}, []);

	const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
	const [fileCursorIndex, setFileCursorIndex] = useState<number>(-1);

	// --------------- Keyboard event interception -------------------
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
	const handleSelectedAll = () => {
		if (selectedFiles.size === mockFiles.length) {
			setSelectedFiles(new Set());
		} else {
			setSelectedFiles(new Set(mockFiles.map((_, index) => index)));
		}
	};
	useKeyCombo({ key: "a", ctrl: true }, handleSelectedAll);
	useKeyCombo({ key: "a", meta: true }, handleSelectedAll);

	// Arrow down handling
	const handleArrowDown = useCallback(() => {
		// No shift
		if (shiftDownIndex === -1) {
			setFileCursorIndex((prev) => {
				const newIndex = Math.min(mockFiles.length - 1, prev + 1);
				setSelectedFiles(new Set<number>().add(newIndex));
				return newIndex;
			});
		}
		// Shifted
		else {
			setFileCursorIndex((prev) => {
				const newIndex = Math.min(mockFiles.length - 1, prev + 1);
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
	}, [shiftDownIndex]);
	useKeyDown("ArrowDown", handleArrowDown, () => {});

	// Arrow up handling
	const handleArrowUp = useCallback(() => {
		// Unshifted
		if (shiftDownIndex === -1) {
			setFileCursorIndex((prev) => {
				const newIndex = Math.max(0, prev - 1);
				setSelectedFiles(new Set<number>().add(newIndex));
				return newIndex;
			});
		}
		// Shifted
		else {
			setFileCursorIndex((prev) => {
				const newIndex = Math.max(0, prev - 1);
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

	return (
		<div className="w-full flex flex-col gap-4">
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
							selectedFiles={selectedFiles}
							setSelectedFiles={setSelectedFiles}
							fileCursorIndex={fileCursorIndex}
							setFileCursorIndex={setFileCursorIndex}
						/>
					) : (
						<FileGridView />
					)}
				</div>
			</div>
		</div>
	);
}
