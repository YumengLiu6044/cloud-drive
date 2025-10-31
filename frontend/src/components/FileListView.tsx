import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { LIST_HEADER_COLS } from "@/constants";
import { ArrowUp, FileText, Folder } from "lucide-react";
import FileListRow from "./FileListRow";
import type { FileListViewProps, ListHeader } from "@/type";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { DragOverlay } from "@dnd-kit/core";
import { useFileStore } from "@/context/fileStore";

export default function FileListView({
	selectedFiles,
	fileCursorIndex,
	handleRowClick,
	handleRowDoubleClick,
	files,
	setFileCursorIndex,
	setSelectedFiles,
	renderedList,
	setRenderedList,
	isTrash,
}: FileListViewProps) {
	const [sortBy, setSortBy] = useState<ListHeader | null>(null);

	useEffect(() => {
		setRenderedList(files);
		setSortBy(null);
	}, [files]);

	useEffect(() => {
		if (sortBy) {
			setRenderedList((prev) => {
				prev.sort((a, b) => {
					const valueA = a[sortBy.id] ?? "";
					const valueB = b[sortBy.id] ?? "";

					if (
						typeof valueA === "string" &&
						typeof valueB === "string"
					) {
						return valueA.localeCompare(valueB);
					} else {
						return (
							Number(a[sortBy.id] ?? 0) -
							Number(b[sortBy.id] ?? 0)
						);
					}
				});

				if (sortBy.sortOrder === "decrease") {
					prev.reverse();
				}
				return prev;
			});
		}
	}, [sortBy]);

	const handleHeadClick = useCallback((headKey: ListHeader) => {
		setSelectedFiles(new Set());
		setFileCursorIndex(-1);

		setSortBy((prev) => {
			if (!prev) {
				return {
					...headKey,
					sortOrder: "increase",
				};
			} else {
				return {
					...headKey,
					sortOrder:
						prev.sortOrder === null
							? "increase"
							: prev.sortOrder === "increase"
							? "decrease"
							: "increase",
				};
			}
		});
	}, []);

	const draggedItem = useFileStore((state) => state.draggedItem);
	const isDragging = useFileStore((state) => state.isDraggingFiles);
	const setDraggingItemIds = useFileStore(
		(state) => state.setDraggingItemIds
	);

	useEffect(() => {
		if (isDragging) {
			setDraggingItemIds(
				[...selectedFiles].map(
					(val, _) => renderedList[val]._id
				)
			);
		} else {
			setDraggingItemIds([]);
		}
	}, [isDragging, selectedFiles, files]);

	return (
		<div>
			<DragOverlay dropAnimation={null}>
				{isDragging && draggedItem && (
					<div className="relative w-fit">
						<div className="text-sm absolute -top-1 -left-2 w-5 aspect-square rounded-full bg-blue-500 text-background flex items-center justify-center shadow-lg">
							{selectedFiles.size}
						</div>
						{selectedFiles.size > 0 &&
							Array.from({
								length: Math.min(3, selectedFiles.size),
							}).map((_, index) => (
								<div
									className="w-30 h-10 overflow-clip flex gap-2 items-center bg-background rounded-xl p-3 shadow-lg cursor-grabbing"
									style={{
										position: "absolute",
										top: index * 5,
										left: index * 5,
										zIndex: -index - 1,
										opacity: 1 - index * 0.1,
									}}
									key={index}
								>
									<div className="w-4 h-4 flex items-center justify-center">
										{index === 0 &&
										draggedItem.is_folder ? (
											<Folder></Folder>
										) : (
											<FileText></FileText>
										)}
									</div>
									<span className="whitespace-nowrap truncate text-xs">
										{index === 0 && draggedItem.name}
									</span>
								</div>
							))}
					</div>
				)}
			</DragOverlay>
			<div
				className="w-full h-full md:w-auto overflow-auto"
				onMouseDown={(e) => e.preventDefault()}
			>
				<Table className="relative">
					<TableHeader>
						<TableRow className="sticky top-0 [&>th]:py-3">
							<TableHead />

							{LIST_HEADER_COLS.map((item, index) => (
								<TableHead
									key={index}
									onClick={() => handleHeadClick(item)}
								>
									<div className="w-full flex justify-between items-center group">
										{item.label}
										{sortBy && sortBy.id === item.id ? (
											<motion.div
												animate={{
													rotate:
														sortBy.sortOrder ===
														"increase"
															? 0
															: 180,
												}}
												transition={{
													type: "tween",
												}}
											>
												<ArrowUp
													className=""
													size={15}
												/>
											</motion.div>
										) : (
											<ArrowUp
												className="opacity-0 group-hover:opacity-100 text-muted-foreground"
												size={15}
											/>
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{renderedList.length > 0 &&
							renderedList.map((item, index) => (
								<FileListRow
									isTrash={isTrash}
									handleRowDoubleClick={handleRowDoubleClick}
									key={item._id}
									onClick={() => handleRowClick(index)}
									item={item}
									isSelected={index === fileCursorIndex}
									isActive={selectedFiles.has(index)}
									isDragging={
										isDragging && selectedFiles.has(index)
									}
								></FileListRow>
							))}

						<TableRow>
							<TableCell></TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
