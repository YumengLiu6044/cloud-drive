import { logo } from "@/assets/assets";
import { Separator } from "./ui/separator";
import { useSidebarStore } from "@/context/sidebarStore";
import { SIDEBAR_ITEMS } from "@/constants";
import { Button } from "./ui/button";
import { HardDrive, Plus } from "lucide-react";
import { Progress } from "./ui/progress";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

export default function Sidebar() {
	const isCollapsed = useSidebarStore((state) => state.isCollapsed);
	const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed);

	const location = useLocation();
	const navigator = useNavigate();

	return (
		<motion.div
			animate={{
				width: isCollapsed ? "6rem" : "16rem",
			}}
			className="h-screen flex flex-col gap-3 bg-accent border-r-1 border-border"
		>
			<div className="flex items-center py-4 px-6">
				<img src={logo} className="w-12"></img>

				<motion.h1
					animate={{
						opacity: isCollapsed ? 0 : 1,
						width: !isCollapsed ? "fit-content" : 0,
						paddingLeft: !isCollapsed ? "0.5rem" : "0",
					}}
					className="text-2xl font-medium text-nowrap"
				>
					Cloud Drive
				</motion.h1>
			</div>

			<div className="py-2 px-4">
				<Button
					variant="outline"
					className={`flex gap-0 justify-start w-full hover:bg-blue-500 hover:text-background rounded-full hover:shadow-xl ${
						isCollapsed && "justify-center"
					}`}
					aria-label="New Folder"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					<Plus className="w-5 h-5" />

					<motion.span
						animate={{
							opacity: isCollapsed ? 0 : 1,
							width: isCollapsed ? 0 : "fit-content",
							paddingLeft: isCollapsed ? 0 : "1.25rem",
						}}
						className="text-nowrap"
					>
						New
					</motion.span>
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

						<motion.span
							animate={{
								opacity: isCollapsed ? 0 : 1,
								width: isCollapsed ? 0 : "fit-content",
								paddingLeft: isCollapsed ? 0 : "1.25rem",
							}}
							className="text-nowrap"
						>
							{item.name}
						</motion.span>
					</Button>
				))}
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
				<div className="flex items-center gap-2">
					<HardDrive className="w-5 h-5" />

					<motion.span
						animate={{
							opacity: isCollapsed ? 0 : 1,
							width: !isCollapsed ? "fit-content" : 0,
						}}
						className="text-nowrap"
					>
						Storage
					</motion.span>
				</div>
				<Progress value={40} />

				<motion.span
					animate={{
						opacity: isCollapsed ? 0 : 1,
					}}
					className="text-xs text-nowrap"
				>
					4.5 GB of 10 GB used
				</motion.span>
			</motion.div>
		</motion.div>
	);
}
