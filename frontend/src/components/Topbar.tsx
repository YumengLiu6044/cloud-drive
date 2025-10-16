import { ChevronDown, LogOut, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSidebarStore } from "@/context/sidebarStore";
import { motion, useAnimation } from "motion/react";
import useAuthStore from "@/context/authStore";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SIDEBAR_ITEMS } from "@/constants";
import { useNavigate } from "react-router-dom";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useEffect, useState } from "react";
import { UserApi } from "@/api/userApi";

export default function Topbar() {
	const toggleIsCollapsed = useSidebarStore(
		(state) => state.toggleIsCollapsed
	);

	const handleLogout = useAuthStore((state) => state.logout);
	const username = useAuthStore((state) => state.username);
	const profileId = useAuthStore((state) => state.profileImageId);

	const { isMobile, type } = useDeviceType();

	const controls = useAnimation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	useEffect(() => {
		controls.start({
			rotate: mobileMenuOpen ? 180 : 0,
			transition: { duration: 0.3 },
		});
	}, [mobileMenuOpen]);

	const navigator = useNavigate();

	return (
		<div className="w-full h-16 py-[10px] px-[20px] md:px-[40px] bg-background flex justify-between border-b-1 border-border">
			<div className="flex gap-3 items-center">
				{!isMobile && (
					<Button variant="outline" onClick={toggleIsCollapsed}>
						<Menu aria-label="Collapse Sidebar Menu" />
					</Button>
				)}
				<div className="relative w-fit h-full">
					<Input
						type="text"
						className="max-w-xs md:w-xs pr-10 h-full"
						placeholder="Search in Drive"
					></Input>
					<Search className="absolute right-3 inset-y-0 text-muted-foreground h-full"></Search>
				</div>
			</div>

			<DropdownMenu
				key={type}
				onOpenChange={setMobileMenuOpen}
				open={mobileMenuOpen}
			>
				<DropdownMenuTrigger className="h-full">
					<div className="h-full flex items-center gap-2">
						<div className="h-full aspect-square flex items-center justify-center rounded-full overflow-clip bg-primary text-background">
							{profileId ? (
								<img
									src={UserApi.getProfilePic(profileId)}
									className="w-full h-full"
								></img>
							) : (
								<span className="uppercase m-2.5">
									{username?.substring(0, 2)}
								</span>
							)}
						</div>
						<motion.div animate={controls}>
							<ChevronDown className="w-3 h-3"></ChevronDown>
						</motion.div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuGroup>
						{SIDEBAR_ITEMS.map((item, index) => (
							<DropdownMenuItem
								className="text-xs md:text-base flex gap-5"
								key={index}
								onClick={() => navigator(item.route)}
							>
								<item.Icon></item.Icon>
								{item.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
					<DropdownMenuSeparator></DropdownMenuSeparator>
					<DropdownMenuItem
						className="text-xs md:text-base flex gap-5"
						onClick={handleLogout}
					>
						<LogOut></LogOut>
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
