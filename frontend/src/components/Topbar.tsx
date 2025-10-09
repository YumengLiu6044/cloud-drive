import { LogOut, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSidebarStore } from "@/context/sidebarStore";
import { AnimatePresence, motion } from "motion/react";
import useAuthStore from "@/context/authStore";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SIDEBAR_ITEMS } from "@/constants";
import { Link } from "react-router-dom";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useDeviceType } from "@/hooks/useDeviceType";

export default function Topbar() {
	const toggleIsCollapsed = useSidebarStore(
		(state) => state.toggleIsCollapsed
	);

	const isSidebarVisible = useSidebarStore((state) => state.isSidebarVisible);
	const handleLogout = useAuthStore((state) => state.logout);

	const { isMobile, type } = useDeviceType();

	return (
		<AnimatePresence>
			{isSidebarVisible && (
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
					exit={{
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
						{!isMobile && (
							<Button
								variant="outline"
								onClick={toggleIsCollapsed}
							>
								<Menu aria-label="Collapse Sidebar Menu" />
							</Button>
						)}
						<div className="relative w-fit h-fit">
							<Input
								type="text"
								className="max-w-xs md:w-xs pr-10"
								placeholder="Search in Drive"
							></Input>
							<Search className="absolute right-3 inset-y-0 text-muted-foreground h-full"></Search>
						</div>
					</div>

					<DropdownMenu key={type}>
						<DropdownMenuTrigger
							className="h-full aspect-square rounded-full bg-accent-foreground"
							disabled={!isMobile}
						></DropdownMenuTrigger>
						<DropdownMenuContent className="mr-3 block md:hidden">
							<DropdownMenuLabel>Account</DropdownMenuLabel>

							<DropdownMenuGroup>
								{SIDEBAR_ITEMS.map((item, index) => (
									<DropdownMenuItem key={index}>
										<item.Icon></item.Icon>
										<Link
											to={item.route}
											className="text-xs"
										>
											{item.name}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
							<DropdownMenuSeparator></DropdownMenuSeparator>
							<DropdownMenuItem
								className="text-xs"
								onClick={handleLogout}
							>
								<LogOut></LogOut>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
