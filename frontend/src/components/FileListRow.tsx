import { LIST_HEADER_COLS } from "@/constants";
import type { CustomNode, FileListRowProps, MockFile } from "@/type";
import { Folder, FileText, EllipsisVertical } from "lucide-react";
import { TableCell, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";

const Cell = ({ children, className = "" }: CustomNode) => (
	<TableCell className={`py-5 ${className}`}>{children}</TableCell>
);

export default function FileListRow({ key, item }: FileListRowProps) {
	return (
		<TableRow key={key} className="group">
			<Cell>
				<Checkbox className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-border" />
			</Cell>
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
