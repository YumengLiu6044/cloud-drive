import { Layout, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCallback, useState } from "react";
import FileListView from "./FileListView";
import FileGridView from "./FileGridView";

export default function FileViewer() {
	const [isListViewSelected, setIsListViewSelected] = useState(true);
	const handleToggleValueChange = useCallback((value: string) => {
		setIsListViewSelected(value === "list");
	}, []);

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="w-full h-fit px-5 md:px-10 py-[10px] bg-card flex items-center justify-between border-b">
				<h2>My Drive</h2>
				<div className="flex items-center gap-5">
					<ToggleGroup
						variant="outline"
						type="single"
						defaultValue="list"
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
					{isListViewSelected ? <FileListView /> : <FileGridView />}
				</div>
			</div>
		</div>
	);
}
