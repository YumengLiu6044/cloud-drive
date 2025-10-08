import { AuthApi } from "@/api/authApi";
import AuthCard from "@/components/AuthCard";
import PasswordField from "@/components/PasswordField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PASSWORD_MIN_LENGTH, SUB_ROUTES } from "@/constants";
import useAuthStore from "@/context/authStore";
import { LoaderCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [isPasswordFocused, setIsPasswordFocused] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

	const navigator = useNavigate();
	const { setToken } = useAuthStore();

	const handleFormSubmit = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			setIsLoading(true);
			if (password !== confirmPassword) {
				toast.error("Passwords do not match");
				setIsLoading(false);
				return;
			}
			if (password.length < PASSWORD_MIN_LENGTH) {
				toast.error("Password must be at least 8 characters");
				setIsLoading(false);
				return;
			}
			AuthApi.register(email, username, password)
				.then((response) => {
					toast.success("Registration successful");
					setToken(response.data.access_token);
          setIsVisible(false);
					setTimeout(() => {
            navigator(SUB_ROUTES.drive.dashboard);
          }, 500);
				})
				.catch((error) => {
					console.error(error);
					switch (error.response?.status) {
						case 409:
							toast.error("Email already in use");
							break;
						default:
							toast.error(
								error.response?.data?.message ||
									"An unexpected error occurred"
							);
							break;
					}
				})
				.finally(() => setIsLoading(false));
		},
		[password, confirmPassword, email, username]
	);

	return (
		<AuthCard
			cardTitle="Register an account"
			cardDescription="Join Cloud Drive today. Create your account"
			key="register-account-card"
      isVisible={isVisible}
		>
			<form>
				<div className="flex flex-col gap-6">
					<div className="flex gap-3">
						<div className="grid gap-2 w-full">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="me@example.com"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-2 w-full">
							<Label htmlFor="username">Username</Label>

							<Input
								id="username"
								type="text"
								autoComplete="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
					</div>

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
							placeholder="Re-enter your password"
							required
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Button
							type="submit"
							className="w-full font-normal"
							disabled={isLoading}
							onClick={handleFormSubmit}
						>
							Sign Up
							{isLoading && (
								<LoaderCircle className="animate-spin"></LoaderCircle>
							)}
						</Button>

						<div className="w-full text-center text-sm text-muted-foreground">
							Already have an account?
							<button
								className="text-medium text-primary hover:underline underline-offset-2"
								type="button"
								onClick={() => navigator(SUB_ROUTES.login)}
							>
								Login
							</button>
						</div>
					</div>
					<div className="relative flex items-center justify-center">
						<div className="absolute inset-0 top-1/2">
							<Separator></Separator>
						</div>
						<p className="px-2 relative text-xs text-muted-foreground bg-card uppercase">
							Or Continue with Google
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						className="w-full font-normal"
					>
						<img
							width="25"
							alt="Google-favicon-vector"
							src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Google-favicon-vector.png?20221007124453"
						/>
						Continue with Google
					</Button>
				</div>
			</form>
		</AuthCard>
	);
}
