import { LogOut, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSidebarStore } from "@/context/sidebarStore";
import { AnimatePresence, motion } from "motion/react";

export default function Topbar() {
	const toggleIsCollapsed = useSidebarStore(
		(state) => state.toggleIsCollapsed
	);

	return (
		<AnimatePresence>
			<motion.div
				transition={{
					delay: 0.5,
				}}
				initial={{
					opacity: 0,
					y: -10,
					height: 0,
					padding: "0 0",
				}}
				animate={{
					opacity: 1,
					y: 0,
					height: "4rem",
					padding: "16px 24px",
				}}
				className="w-full bg-accent py-4 px-6 flex justify-between border-b-1 border-border"
			>
				<div className="flex gap-3 items-center">
					<Button variant="outline" onClick={toggleIsCollapsed}>
						<Menu aria-label="Collapse Sidebar Menu" />
					</Button>
					<div className="relative w-fit h-fit">
						<Input
							type="text"
							className="w-xs pr-10"
							placeholder="Search in Drive"
						></Input>
						<Search className="absolute right-3 inset-y-0 text-muted-foreground h-full"></Search>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button variant="outline">
						<LogOut aria-label="Log out"></LogOut>
					</Button>

					<div className="h-full aspect-square rounded-full bg-foreground"></div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
