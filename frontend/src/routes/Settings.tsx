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
	UserRoundPlus,
  Camera,
} from "lucide-react";

export default function Settings() {
	return (
		<div className="w-full flex flex-col gap-4 p-3 md:p-8 h-[90vh] overflow-y-scroll">
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
							<div className="relative w-full max-w-[150px] bg-gradient-to-r from-blue-500 to-purple-300 rounded-full aspect-square flex items-center justify-center p-1">
								<div className="w-full rounded-full aspect-square border-background border-4 flex items-center justify-center p-8">
								</div>
                <div className="absolute right-0 bottom-0 w-8 rounded-full aspect-square bg-gradient-to-r from-blue-500 to-purple-300 flex items-center justify-center">
                  <Camera size={20} className="text-background"></Camera>
                </div>
							</div>

              <Button type="button" className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-300 hover:from-blue-400 hover:to-purple-200 transition-colors">
                Upload Photo
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
										// value={tempUsername}
										// onChange={(e) =>
										// 	setTempUsername(e.target.value)
										// }
										// disabled={!isEditing}
										className="flex-1"
									/>
									{!false ? (
										<Button
											// onClick={() => setIsEditing(true)}
											variant="outline"
										>
											Edit
										</Button>
									) : (
										<>
											<Button
											// onClick={handleSaveUsername}
											>
												Save
											</Button>
											<Button
												// onClick={handleCancelEdit}
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
									// value={email}
									disabled
									className="bg-muted"
								/>
								<p className="text-xs text-muted-foreground">
									Your email address cannot be changed
								</p>
							</div>

							{/* Sign out button */}
							<Button
								// onClick={handleSignOut}
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
											<Button variant="destructive">
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
