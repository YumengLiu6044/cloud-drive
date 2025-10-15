import { LIST_HEADER_COLS } from "@/constants";
import type { CustomNode, FileListRowProps, Resource } from "@/type";
import { Folder, FileText } from "lucide-react";
import { TableCell, TableRow } from "./ui/table";
import { useEffect, useRef } from "react";

const Cell = ({ children, className = "" }: CustomNode) => (
	<TableCell className={`py-5 ${className}`}>{children}</TableCell>
);

export default function FileListRow({
	item,
	isActive,
	isSelected,
	onClick,
}: FileListRowProps) {
	const rowRef = useRef<HTMLTableRowElement>(null);
	useEffect(() => {
		const currentNode = rowRef.current;
		if (!currentNode) return;

		if (isSelected) {
			currentNode.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [isSelected]);

	return (
		<TableRow
			ref={rowRef}
			className={`
				group
				${isActive ? "bg-blue-100 hover:bg-blue-100" : ""} 
				${isSelected ? "outline outline-blue-500" : ""} 
				`}
			onClick={onClick}
		>
			<Cell />
			{Object.keys(LIST_HEADER_COLS).map((key, _) => (
				<Cell key={key}>
					<div className="flex gap-2 items-center">
						{key === "name" &&
							(item.is_folder ? (
								<Folder size={15}></Folder>
							) : (
								<FileText size={15}></FileText>
							))}
						<span>
							{key === "last_modified"
								? new Date(
										item.last_modified
								  ).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
								  })
								: item[key as keyof Resource]}
						</span>
					</div>
				</Cell>
			))}
		</TableRow>
	);
}
