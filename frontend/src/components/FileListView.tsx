import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { LIST_HEADER_COLS } from "@/constants";
import { ArrowUp } from "lucide-react";
import FileListRow from "./FileListRow";
import type { FileListViewProps } from "@/type";
import { useFileStore } from "@/context/fileStore";

export default function FileListView({
	selectedFiles,
	fileCursorIndex,
	handleRowClick
}: FileListViewProps) {
	const {files} = useFileStore()

	return (
		<div className="h-[80vh] w-[90vw] md:w-auto overflow-auto">
			<Table className="relative">
				<TableHeader>
					<TableRow className="sticky top-0 [&>th]:py-3">
						<TableHead/>

						{Object.entries(LIST_HEADER_COLS).map(
							([key, value]) => (
								<TableHead key={key}>
									<div className="w-full flex justify-between items-center group">
										{value}
										<ArrowUp
											className="opacity-0 group-hover:opacity-100 text-muted-foreground"
											size={15}
										/>
									</div>
								</TableHead>
							)
						)}
					</TableRow>
				</TableHeader>

				<TableBody>
					{files.length && files.map((item, index) => (
						<FileListRow
							key={index}
							onClick={() => handleRowClick(index)}
							item={item}
							isSelected={index === fileCursorIndex}
							isActive={selectedFiles.has(index)}
						></FileListRow>
					))}
					<TableRow>
						<TableCell></TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
