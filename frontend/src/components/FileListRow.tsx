import { LIST_HEADER_COLS } from "@/constants";
import type { CustomNode, FileListRowProps, MockFile } from "@/type";
import { Folder, FileText, EllipsisVertical } from "lucide-react";
import { TableCell, TableRow } from "./ui/table";

const Cell = ({ children, className = "" }: CustomNode) => (
	<TableCell className={`py-5 ${className}`}>{children}</TableCell>
);

export default function FileListRow({
	item,
	isActive,
	isSelected,
	onClick,
}: FileListRowProps) {
	return (
		<TableRow
			className={`${isSelected ? "bg-blue-100 hover:bg-blue-100" : ""} ${
				isActive ? "outline outline-blue-500" : ""
			} group`}
			onClick={onClick}
		>
			<Cell />
			{Object.keys(LIST_HEADER_COLS).map((key, _) => (
				<Cell key={key}>
					<div className="flex gap-2 items-center">
						{key === "name" &&
							(item.type === "folder" ? (
								<Folder size={15}></Folder>
							) : (
								<FileText size={15}></FileText>
							))}
						<span>{item[key as keyof MockFile]}</span>
					</div>
				</Cell>
			))}
			<Cell className="flex justify-end">
				<EllipsisVertical
					size={20}
					className="text-transparent group-hover:text-muted-foreground"
				/>
			</Cell>
		</TableRow>
	);
}
