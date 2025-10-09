import { logo } from "@/assets/assets";
import { Separator } from "./ui/separator";
import { useSidebarStore } from "@/context/sidebarStore";
import { SIDEBAR_ITEMS } from "@/constants";
import { Button } from "./ui/button";
import { HardDrive, Plus } from "lucide-react";
import { Progress } from "./ui/progress";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import CollapsibleText from "./CollapsibleText";
import { useCallback } from "react";

const secondaryState = { opacity: 0, x: -10, width: 0 };
const mainState = { opacity: 1, x: 0 };

export default function Sidebar() {
	const isCollapsed = useSidebarStore((state) => state.isCollapsed);
	const isSidebarVisible = useSidebarStore((state) => state.isSidebarVisible);

	const location = useLocation();
	const navigator = useNavigate();

	const controls = useAnimation();
	const handleMouseEnter = useCallback(() => {
		controls.set({ rotate: 0 });
		controls.start({
			rotate: 180,
			transition: { duration: 0.8 },
		});
	}, []);

	const handleMouseLeave = useCallback(() => {
		controls.set({ rotate: 0 });
	}, []);

	return (
		<AnimatePresence>
			{isSidebarVisible && (
				<motion.div
					initial={secondaryState}
					exit={secondaryState}
					animate={{
						...mainState,
						width: isCollapsed ? "6rem" : "18rem",
					}}
					className="hidden md:flex h-screen flex-col gap-3 bg-accent border-r-1 border-border"
				>
					<div className="flex items-center py-4 px-6">
						<img src={logo} className="w-12"></img>

						<CollapsibleText
							isCollapsed={isCollapsed}
							animate={{
								paddingLeft: !isCollapsed ? "0.5rem" : "0",
							}}
							className="text-2xl font-medium"
						>
							Cloud Drive
						</CollapsibleText>
					</div>

					<div className="py-2 px-4">
						<Button
							variant="outline"
							className={`flex gap-0 justify-start w-full hover:bg-blue-500 hover:text-background rounded-full hover:shadow-xl ${
								isCollapsed && "justify-center"
							}`}
							aria-label="New Folder"
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
						>
							<motion.div animate={controls}>
								<Plus className="w-5 h-5" />
							</motion.div>

							<CollapsibleText
								isCollapsed={isCollapsed}
								animate={{
									paddingLeft: isCollapsed ? 0 : "1.25rem",
								}}
							>
								New
							</CollapsibleText>
						</Button>
					</div>

					<div className="h-full w-full flex flex-col gap-2 py-2 px-4">
						{SIDEBAR_ITEMS.map((item, index) => (
							<Button
								key={index}
								variant="ghost"
								className={`flex justify-start w-full gap-0 ${
									isCollapsed && "justify-center"
								} ${
									location.pathname === item.route
										? "text-background bg-blue-500 hover:bg-blue-500 hover:text-background"
										: "text-primary hover:border border-blue-400 hover:text-primary hover:bg-accent"
								}`}
								onClick={() => navigator(item.route)}
							>
								<item.Icon className="w-5 h-5"></item.Icon>

								<CollapsibleText
									isCollapsed={isCollapsed}
									animate={{
										paddingLeft: isCollapsed
											? 0
											: "1.25rem",
									}}
								>
									{item.name}
								</CollapsibleText>
							</Button>
						))}
						<div className="h-full" />
					</div>
					<Separator className="text-border"></Separator>
					{/* Storage */}
					<motion.div
						layout
						style={{
							alignItems: isCollapsed ? "center" : "flex-start",
						}}
						className={`flex flex-col gap-2 py-4 px-4 text-sm text-muted-foreground`}
					>
						<div className="flex items-center">
							<HardDrive className="w-5 h-5" />

							<CollapsibleText
								animate={{
									paddingLeft: isCollapsed ? 0 : "8px",
								}}
								isCollapsed={isCollapsed}
							>
								Storage
							</CollapsibleText>
						</div>
						<Progress value={40} />

						<CollapsibleText isCollapsed={isCollapsed}>
							4.5 GB of 10 GB used
						</CollapsibleText>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
