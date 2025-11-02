import { LIST_HEADER_COLS, SIDEBAR_ITEMS } from "@/constants";
import type { CustomNode, FileListRowProps } from "@/type";
import { Folder, FileText, GripVertical } from "lucide-react";
import { TableCell, TableRow } from "./ui/table";
import { useCallback, useEffect } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

const Cell = ({ children, className = "" }: CustomNode) => (
	<TableCell className={`py-5 ${className}`}>{children}</TableCell>
);

function getDayText(dateObj: Date) {
	const now = new Date();

	// One day ago (UTC)
	const oneDayAgo = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
	);

	// One week ago (UTC)
	const oneWeekAgo = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7)
	);

	// Convert dateObj to UTC midnight for comparison
	const dateUTC = new Date(
		Date.UTC(
			dateObj.getUTCFullYear(),
			dateObj.getUTCMonth(),
			dateObj.getUTCDate()
		)
	);

	if (dateUTC > oneDayAgo) {
		// Less than 1 day ago → show time
		return dateObj.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	} else if (dateUTC > oneWeekAgo) {
		// Between 1 day and 1 week ago → show "x Days Ago"
		const diffTime = now.getTime() - dateObj.getTime();
		const dayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return `${dayCount} Day${dayCount > 1 ? "s" : ""} Ago`;
	} else {
		// More than a week ago → show date
		return dateObj.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}
}

export default function FileListRow({
	item,
	isActive,
	isSelected,
	isDragging,
	onClick,
	handleRowDoubleClick,
	isTrash,
}: FileListRowProps) {
	const {
		attributes,
		listeners,
		setNodeRef: setNodeDragRef,
		node,
	} = useDraggable({
		id: item._id,
		data: {
			item,
			type: isTrash ? SIDEBAR_ITEMS.trash.name : SIDEBAR_ITEMS.files.name,
		},
	});
	const {setNodeRef: setNodeDropRef, isOver} = useDroppable({
		id: item._id,
		disabled: isTrash,
		data: {
			accepts: SIDEBAR_ITEMS.files.name,
			type: isTrash ? SIDEBAR_ITEMS.trash.name : SIDEBAR_ITEMS.files.name,
		},
	});

	useEffect(() => {
		const currentNode = node.current;
		if (!currentNode) return;

		if (isSelected) {
			currentNode.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [isSelected]);

	const onDoubleClick = useCallback(() => {
		handleRowDoubleClick(item);
	}, [item]);

	return (
		<TableRow
			ref={isActive ? setNodeDragRef : setNodeDropRef}
			{...attributes}
			className={`
				group
				${isActive ? "bg-blue-100 hover:bg-blue-100" : ""} 
				${isSelected || (isOver && item.is_folder) ? "outline outline-blue-500" : ""} 
				${isDragging ? "opacity-50" : ""}
				`}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
		>
			<Cell className="px-0 flex justify-center">
				{isActive && (
					<GripVertical
						size={20}
						{...listeners}
						className="text-muted-foreground hover:text-primary transition-colors cursor-grab"
					></GripVertical>
				)}
			</Cell>
			{LIST_HEADER_COLS.map((header, index) => (
				<Cell
					key={index}
					className={header.id === "name" ? "max-w-[100px]" : ""}
				>
					<div className="flex gap-2 items-center">
						{header.id === "name" && (
							<div>
								{item.is_folder ? (
									<Folder className="w-5 h-5"></Folder>
								) : (
									<FileText className="w-5 h-5"></FileText>
								)}
							</div>
						)}
						<span className="truncate">
							{header.id === "last_modified"
								? getDayText(
										new Date(item.last_modified * 1000)
								  )
								: item[header.id]}
						</span>
					</div>
				</Cell>
			))}
		</TableRow>
	);
}
