import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { LIST_HEADER_COLS, mockFiles } from "@/constants";
import { ArrowUp } from "lucide-react";
import FileListRow from "./FileListRow";

export default function FileListView() {
	return (
		<div className="h-[80vh] w-[90vw] md:w-auto overflow-auto">
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
						<FileListRow key={index} item={item}></FileListRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
