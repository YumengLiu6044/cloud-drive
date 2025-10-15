import { motion, useAnimation } from "motion/react";
import { Button } from "./ui/button";
import { FolderPlus, Loader2, Plus, Upload } from "lucide-react";
import CollapsibleText from "./CollapsibleText";
import { useCallback, useMemo, useState } from "react";
import type { NewFolderButtonProps } from "@/type";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { DriveApi } from "@/api/driveApi";
import { useFileStore } from "@/context/fileStore";

export default function NewFolderButton({ isCollapsed }: NewFolderButtonProps) {
	// Animation management
	const controls = useAnimation();
	const handleMouseEnter = useCallback(() => {
		controls.set({ rotate: 0 });
		controls.start({
			rotate: 90,
			transition: { duration: 0.5 },
		});
	}, []);

	const handleMouseLeave = useCallback(() => {
		controls.set({ rotate: 0 });
	}, []);

	// Modal management
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleDialogOpenChange = useCallback(
		(newState: boolean) => {
			if (!isLoading) {
				if (newState) {
					returnToMain();
				}
				setIsDialogOpen(newState);
			}
		},
		[isLoading]
	);

	// File states
	const currentDirectory = useFileStore((state) => state.currentDirectory);
	const refreshFiles = useFileStore((state) => state.refreshFiles);

	const [newFolderName, setNewFolderName] = useState("");
	const [isCreateNewFolder, setIsCreateNewFolder] = useState(false);
	const [isUploadNewFodler, setIsUploadNewFolder] = useState(false);
	const returnToMain = useCallback(() => {
		setIsCreateNewFolder(false);
		setIsUploadNewFolder(false);
	}, []);

	const handleSubmit = useCallback(() => {
		// API call for creating new file
		const sanitizedName = DOMPurify.sanitize(newFolderName);
		if (!sanitizedName) {
			toast.error("The folder name can't be empty");
			return;
		}
		if (!currentDirectory) {
			toast.error("Unexpected directory error");
			return;
		}

		setIsLoading(true);

		DriveApi.createNewFolder(currentDirectory.id, newFolderName)
			.then(() => {
				refreshFiles();
				setIsDialogOpen(false);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [newFolderName, currentDirectory, newFolderName]);

	const cardTitle = useMemo(() => {
		if (isCreateNewFolder) {
			return {
				title: "Create New Folder",
				description: `Create new folder under ${currentDirectory?.name}`,
			};
		} else if (isUploadNewFodler) {
			return {
				title: "Upload Files",
				description: "Upload local files to Cloud Drive",
			};
		} else {
			return {
				title: "Add Files or Folder",
				description: "Select an action to get started",
			};
		}
	}, [isCreateNewFolder, isUploadNewFodler, currentDirectory]);

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger
				className={`border border-border p-2 px-3 flex gap-0 items-center text-sm justify-start w-full hover:bg-blue-500 hover:text-background rounded-full hover:shadow-xl ${
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
					className="font-medium"
					animate={{
						paddingLeft: isCollapsed ? 0 : "1.25rem",
					}}
				>
					New
				</CollapsibleText>
			</DialogTrigger>
			<DialogContent className="bg-accent">
				<DialogHeader>
					<DialogTitle>{cardTitle.title}</DialogTitle>
					<DialogDescription>
						{cardTitle.description}
					</DialogDescription>
				</DialogHeader>
				{/* Main Menu */}
				{!isCreateNewFolder && !isUploadNewFodler && (
					<div className="w-full flex flex-col md:flex-row items-center gap-5 [&>button]:bg-card">
						<button
							className="group hover:bg-primary h-full w-full p-5 rounded-xl border border-border flex flex-col gap-1 justify-center items-center transition-all"
							aria-label="New folder"
							onClick={() => setIsCreateNewFolder(true)}
						>
							<div className="p-4 rounded-full bg-primary group-hover:bg-background transition-all">
								<FolderPlus
									className="text-background group-hover:text-primary transition-all"
									size={30}
								></FolderPlus>
							</div>
							<div className="flex flex-col items-center">
								<p className="text-xl font-medium group-hover:text-background transition-all">
									New Folder
								</p>
								<p className="text-sm text-muted-foreground text-cente group-hover:text-accent transition-all">
									Create a new folder
								</p>
							</div>
						</button>
						<button
							className="group hover:bg-blue-500 h-full w-full p-5 rounded-xl border border-border flex flex-col gap-1 justify-center items-center transition-all"
							aria-label="Upload files"
							onClick={() => setIsUploadNewFolder(true)}
						>
							<div className="p-4 rounded-full bg-blue-500 group-hover:bg-background transition-all">
								<Upload
									className="text-background group-hover:text-blue-500 transition-all"
									size={30}
								></Upload>
							</div>
							<div className="flex flex-col items-center">
								<p className="text-xl font-medium group-hover:text-background transition-all">
									Upload Files
								</p>
								<p className="text-sm text-muted-foreground text-cente group-hover:text-accent transition-all">
									Upload existing files
								</p>
							</div>
						</button>
					</div>
				)}
				{isCreateNewFolder && (
					<div className="grid gap-3">
						<Label htmlFor="folder-name">Folder Name</Label>
						<Input
							id="folder-name"
							name="folder-name"
							className="bg-card"
							type="text"
							value={newFolderName}
							onChange={(e) => setNewFolderName(e.target.value)}
						/>
					</div>
				)}
				{isUploadNewFodler && (
					<button
						className="h-full w-full p-5 rounded-xl flex flex-col gap-1 justify-center items-center border-2 border-dashed border-secondary hover:border-primary transition-colors bg-card"
						aria-label="Upload files"
						onClick={() => setIsUploadNewFolder(true)}
					>
						<div className="p-4 rounded-full bg-blue-500">
							<Upload
								className="text-background"
								size={30}
							></Upload>
						</div>
						<div className="flex flex-col items-center">
							<p className="text-xl">
								Click to upload or drag and drop
							</p>
							<p className="text-sm text-muted-foreground text-cente">
								Select one or more files
							</p>
						</div>
					</button>
				)}

				{(isCreateNewFolder || isUploadNewFodler) && (
					<DialogFooter>
						<div className="w-full flex justify-between">
							<Button variant="outline" onClick={returnToMain}>
								Back
							</Button>

							<Button
								type="submit"
								className="px-5"
								disabled={isLoading}
								onClick={handleSubmit}
							>
								{isCreateNewFolder && (
									<span>Create Folder</span>
								)}
								{isUploadNewFodler && <span>Upload Files</span>}
								{isLoading && (
									<Loader2 className="animate-spin"></Loader2>
								)}
							</Button>
						</div>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
