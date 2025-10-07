import { AuthApi } from "@/api/authApi";
import { logo } from "@/assets/assets";
import Container from "@/components/Container";
import PasswordField from "@/components/PasswordField";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASSWORD_MIN_LENGTH, SUB_ROUTES } from "@/constants";
import { LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPassword() {
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const navigator = useNavigate();
	const onClickBacktoLogin = () => navigator(SUB_ROUTES.login);

	const [searchParams] = useSearchParams();
	const resetToken = searchParams.get("token") ?? "";

	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = useCallback(
		(password: string, resetToken: string) => {
			if (!resetToken) {
				toast.error("Invalid or missing reset token");
				return;
			}
			if (password.length < PASSWORD_MIN_LENGTH) {
				toast.error("Password must be at least 8 characters long");
				return;
			}
			if (password !== confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}
			setIsLoading(true);
			AuthApi.resetPassword(password, resetToken)
				.then(() => {
					toast.success("Password reset successfully");
				})
				.catch((error) => {
					console.error(error);
					switch (error.response?.status) {
						case 401:
							toast.error("Invalid or expired reset token");
							return;
						case 404:
							toast.error("User not found");
							return;
						default:
							toast.error("An unexpected error occurred");
							break;
					}
				})
				.finally(() => setIsLoading(false));
		},
		[password, confirmPassword]
	);

	return (
		<Container className="flex flex-col justify-center items-center">
			<div className="pb-3 flex flex-col items-center">
				<img src={logo} className="w-full max-w-[70px]"></img>
				<h1 className="text-primary text-3xl font-bold">Cloud Drive</h1>
			</div>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Reset your password</CardTitle>
					<CardDescription>
						Input your new password below to reset your password
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>

						<PasswordField
							setIsPasswordFocused={setIsPasswordFocused}
							setPassword={setPassword}
							password={password}
							autoComplete="new-password"
						></PasswordField>
						{isPasswordFocused && (
							<p className="w-full text-start text-muted-foreground text-xs">
								Minimum Length: 8
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="confirm_password">
							Confirm Password
						</Label>

						<Input
							autoComplete="new-password"
							id="confirm_password"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					<div className="w-full grid gap-2">
						<Button
							type="submit"
							className="font-normal"
							onClick={() =>
								handleResetPassword(password, resetToken ?? "")
							}
							disabled={isLoading}
						>
							Reset Password
							{isLoading && (
								<LoaderCircle className="animate-spin"></LoaderCircle>
							)}
						</Button>
						<Button
							type="button"
							variant="ghost"
							className="font-normal"
							onClick={onClickBacktoLogin}
						>
							Go Back to Login
						</Button>
					</div>
				</CardContent>
			</Card>
		</Container>
	);
}
