import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { LIST_HEADER_COLS } from "@/constants";
import { ArrowUp } from "lucide-react";
import FileListRow from "./FileListRow";
import type { FileListViewProps, ListHeader } from "@/type";
import { useFileStore } from "@/context/fileStore";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

export default function FileListView({
	selectedFiles,
	fileCursorIndex,
	handleRowClick,
	handleRowDoubleClick,
}: FileListViewProps) {
	const files = useFileStore((state) => state.files);

	const [sortBy, setSortBy] = useState<ListHeader | null>(null);
	const [renderedList, setRenderedList] = useState(files);

	useEffect(() => {
		console.log(files)
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

	return (
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
											style={{
												rotate:
													sortBy.sortOrder ===
													"increase"
														? 0
														: 180,
											}}
										>
											<ArrowUp className="" size={15} />
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
								handleRowDoubleClick={handleRowDoubleClick}
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
