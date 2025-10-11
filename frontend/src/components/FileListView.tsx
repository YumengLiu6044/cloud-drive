import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { LIST_HEADER_COLS, mockFiles } from "@/constants";
import { ArrowUp, EllipsisVertical, FileText, Folder } from "lucide-react";
import type { CustomNode, MockFile } from "@/type";
import { useEffect, useRef, useState } from "react";

const Cell = ({ children, className = "" }: CustomNode) => (
	<TableCell className={`py-5 ${className}`}>{children}</TableCell>
);

export default function FileListView() {
	const divRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!divRef.current) return;

		const { width, height } = divRef.current.getBoundingClientRect();
		setSize({ width, height });

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const { width, height } = entry.contentRect;
				setSize({ width, height });
			}
		});

		observer.observe(divRef.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div className="w-full h-full" ref={divRef}>
			<div className="overflow-auto" style={size}>
				<Table className="relative">
					<TableHeader>
						<TableRow className="sticky top-0 [&>th]:py-3">
							<TableHead>
								<Checkbox className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-border" />
							</TableHead>

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
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{mockFiles.map((item, index) => (
							<TableRow key={index} className="group">
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
													<FileText
														size={15}
													></FileText>
												))}
											<span>
												{item[key as keyof MockFile]}
											</span>
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
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
