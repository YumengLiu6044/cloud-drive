import {
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import {
	User,
	LogOut,
	Trash2,
	CircleAlert,
	Image,
	Camera,
	Loader2,
} from "lucide-react";
import useAuthStore from "@/context/authStore";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import { UserApi } from "@/api/userApi";
import { AuthApi } from "@/api/authApi";

export default function Settings() {
	// User info state
	const email = useAuthStore((state) => state.email);
	const username = useAuthStore((state) => state.username);
	const profileImageId = useAuthStore((state) => state.profileImageId);
	const { setUsername, logout, setProfileImageId } = useAuthStore.getState();
	const [isEditing, setIsEditing] = useState(false);
	const [tempUsername, setTempUsername] = useState(username ?? "");
	const [isLoadingUsername, setIsLoadingUsername] = useState(false);

	const handleSaveUsername = useCallback(() => {
		const cleanedUsername = DOMPurify.sanitize(tempUsername);
		if (!cleanedUsername) {
			toast.error("Username can't be empty");
			return;
		}

		setIsLoadingUsername(true);
		UserApi.changeUserName(tempUsername)
			.then(() => {
				setUsername(tempUsername);
			})
			.finally(() => {
				setIsLoadingUsername(false);
				setIsEditing(false);
			});
	}, [tempUsername]);

	const handleCancelEdit = useCallback(() => {
		if (!isLoadingUsername) {
			setIsEditing(false);
			setTempUsername(username ?? "");
		}
	}, [username, isLoadingUsername]);

	// Profile pic state
	const fileRef = useRef<HTMLInputElement>(null);
	const [isUploadingFile, setIsUploadingFile] = useState(false);

	const handleClickUpload = useCallback(() => {
		const inputNode = fileRef.current;
		if (inputNode) {
			inputNode.click();
		}
	}, []);

	const handleProfileChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const newFile = e.target.files?.[0];
			if (newFile) {
				setIsUploadingFile(true);
				UserApi.uploadProfilePic(newFile)
					.then((response) => {
						const newProfileId = response.data.profile_image_id;
						setProfileImageId(newProfileId);
					})
					.finally(() => setIsUploadingFile(false));
			}
		},
		[]
	);

	const handleDeleteAccount = useCallback((_: any) => {
		AuthApi.deleteAccount()
			.then(logout)
	}, [])

	return (
		<div className="main-section w-full flex flex-col gap-4 overflow-y-scroll">
			<div className="mb-3">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					Settings
				</h1>
				<p className="mt-1 text-muted-foreground">
					Manage your account settings and preferences
				</p>
			</div>

			<div className="flex flex-col lg:flex-row w-full gap-5">
				<Card className="w-full lg:w-3/11 h-fit">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Image className="h-5 w-5" />
							Profile Picture
						</CardTitle>
						<CardDescription>
							Upload a photo to personalize your profile
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="w-full flex flex-col items-center justify-center gap-5">
							<div className="relative w-full max-w-[150px] bg-theme rounded-full aspect-square flex items-center justify-center p-1">
								<div className="w-full rounded-full aspect-square overflow-clip border-background border-4 flex items-center justify-center">
									{profileImageId && (
										<img
											className="w-full h-full aspect-auto"
											src={UserApi.getProfilePic(
												profileImageId
											)}
										></img>
									)}
								</div>
								<div className="absolute right-0 bottom-0 w-8 rounded-full aspect-square bg-theme flex items-center justify-center">
									<Camera
										size={20}
										className="text-background"
									></Camera>
								</div>
							</div>
							<input
								className="hidden"
								ref={fileRef}
								type="file"
								accept="image/*"
								maxLength={1}
								required
								onChange={handleProfileChange}
							></input>
							<Button
								type="button"
								className="w-full lg:w-auto bg-blue-500 hover:bg-blue-400 transition-colors"
								onClick={handleClickUpload}
								disabled={isUploadingFile}
							>
								Upload Photo
								{isUploadingFile && (
									<Loader2 className="animate-spin"></Loader2>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
				<div className="flex-1 space-y-5">
					{/* Profile Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								Profile
							</CardTitle>
							<CardDescription>
								Update your personal information and account
								details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Username Field */}
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<div className="flex gap-2">
									<Input
										id="username"
										value={tempUsername}
										onChange={(e) =>
											setTempUsername(e.target.value)
										}
										disabled={!isEditing}
										className="flex-1"
									/>
									{!isEditing ? (
										<Button
											onClick={() => setIsEditing(true)}
											variant="outline"
										>
											Edit
										</Button>
									) : (
										<>
											<Button
												onClick={handleSaveUsername}
												disabled={isLoadingUsername}
											>
												Save
												{isLoadingUsername && (
													<Loader2 className="animate-spin"></Loader2>
												)}
											</Button>
											<Button
												onClick={handleCancelEdit}
												variant="outline"
											>
												Cancel
											</Button>
										</>
									)}
								</div>
							</div>

							<Separator />

							{/* Email Field (Read-only) */}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									value={email ?? ""}
									disabled
									className="bg-muted"
								/>
								<p className="text-xs text-muted-foreground">
									Your email address cannot be changed
								</p>
							</div>

							{/* Sign out button */}
							<Button
								onClick={logout}
								variant="outline"
								className="w-full lg:w-auto bg-transparent"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Sign Out
							</Button>
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card className="border-destructive/50">
						<CardHeader>
							<CardTitle className="text-destructive flex items-center gap-2">
								<CircleAlert className="w-5 h-5 text-destructive"></CircleAlert>
								Danger Zone
							</CardTitle>
							<CardDescription>
								Irreversible actions that will permanently
								affect your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										className="w-full lg:w-auto"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Account
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This
											will permanently delete your account
											and remove all of your data from our
											servers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<div className="w-full flex justify-between">
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<Button variant="destructive" onClick={handleDeleteAccount}>
												Delete Account
											</Button>
										</div>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
