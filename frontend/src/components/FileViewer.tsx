import { Layout, List, SlidersHorizontal } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useSidebarStore } from "@/context/sidebarStore";

export default function FileViewer() {
	return (
		<div className="w-full grid gap-4">
			<div className="w-full px-5 md:px-10 py-[10px] bg-card flex items-center justify-between border-b">
				<h2>My Drive</h2>
				<div className="flex items-center gap-5">
					<SlidersHorizontal size={20}></SlidersHorizontal>

					<ToggleGroup variant="outline" type="single">
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

			<div></div>
		</div>
	);
}
