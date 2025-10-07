import { AuthApi } from "@/api/authApi";
import { logo } from "@/assets/assets";
import Container from "@/components/Container";
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
import { Separator } from "@/components/ui/separator";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import PasswordField from "@/components/PasswordField";
import { PASSWORD_MIN_LENGTH, SUB_ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/context/authStore";
import { LoaderCircle } from "lucide-react";

export default function Login() {
	const [isForget, setIsForget] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [resetEmail, setResetEmail] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const navigator = useNavigate();
	const { setToken } = useAuthStore();

	const handleSendPasswordReset = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (!resetEmail) {
				toast.error("Please enter your email");
				return;
			}
			setIsLoading(true);
			AuthApi.forgotPassword(resetEmail)
				.then(() => {
					toast.success(
						"Password reset link has been sent to your email."
					);
					setIsForget(false);
				})
				.catch((error) => {
					console.error(error);
					toast.error(
						error.response?.data?.message || "Error occurred"
					);
				})
				.finally(() => setIsLoading(false));
		},
		[resetEmail]
	);

	const handleFormSubmit = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (!email || !password) {
				toast.error("Please fill in all required fields");
				return;
			}
			setIsLoading(true);
			if (isSignUp) {
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
						setTimeout(() => {
							navigator(SUB_ROUTES.drive.base);
						}, 1000);
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
				return;
			} else {
				AuthApi.login(email, password)
					.then((response) => {
						toast.success("Login successful");
						setToken(response.data.access_token);
						setTimeout(() => {
							navigator(SUB_ROUTES.drive.base);
						}, 1000);
					})
					.catch((error) => {
						console.error(error);
						switch (error.response?.status) {
							case 401:
								toast.error("Invalid email or password");
								break;
							case 404:
								toast.error("User not found");
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
			}
		},
		[email, password, confirmPassword, isSignUp, username, navigator]
	);

	return (
		<Container className="flex flex-col justify-center items-center">
			<div className="pb-3 flex flex-col items-center">
				<img src={logo} className="w-full max-w-[70px]"></img>
				<h1 className="text-primary text-3xl font-bold">Cloud Drive</h1>
			</div>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>
						{isForget
							? "Forgot Password"
							: "Welcome to Cloud Drive"}
					</CardTitle>
					<CardDescription>
						{isForget
							? "Enter your email below to receive a reset link"
							: !isSignUp
							? "Enter your email below to login to your account"
							: "Register an account with your email"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						{!isForget ? (
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
											onChange={(e) =>
												setEmail(e.target.value)
											}
										/>
									</div>
									{isSignUp && (
										<div className="grid gap-2 w-full">
											<Label htmlFor="username">
												Username
											</Label>

											<Input
												id="username"
												type="text"
												autoComplete="username"
												value={username}
												onChange={(e) =>
													setUsername(e.target.value)
												}
												required
											/>
										</div>
									)}
								</div>

								<div className="grid gap-2">
									<div className="flex justify-between">
										<Label htmlFor="password">
											Password
										</Label>
										{!isSignUp && (
											<button
												className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
												onClick={() =>
													setIsForget(true)
												}
												type="button"
											>
												Forgot your password?
											</button>
										)}
									</div>

									<PasswordField
										setIsPasswordFocused={
											setIsPasswordFocused
										}
										setPassword={setPassword}
										password={password}
										autoComplete={
											isSignUp
												? "new-password"
												: "current-password"
										}
									></PasswordField>
									{isSignUp && isPasswordFocused && (
										<p className="w-full text-start text-muted-foreground text-xs">
											Minimum Length: 8
										</p>
									)}
								</div>
								{isSignUp && (
									<div className="grid gap-2">
										<Label htmlFor="confirm_password">
											Confirm Password
										</Label>

										<Input
											autoComplete="new-password"
											id="confirm_password"
											type="password"
											value={confirmPassword}
											onChange={(e) =>
												setConfirmPassword(
													e.target.value
												)
											}
											placeholder="Re-enter your password"
											required
										/>
									</div>
								)}
								<div className="flex flex-col gap-2">
									<Button
										type="submit"
										className="w-full font-normal"
										disabled={isLoading}
										onClick={handleFormSubmit}
									>
										{isSignUp ? "Sign Up" : "Login"}
										{isLoading && (
											<LoaderCircle className="animate-spin"></LoaderCircle>
										)}
									</Button>

									<div className="w-full text-center text-sm text-muted-foreground">
										{isSignUp
											? "Already have an account?"
											: "Don't have an account?"}{" "}
										<button
											className="text-medium text-primary hover:underline underline-offset-2"
											type="button"
											onClick={() =>
												setIsSignUp((prev) => !prev)
											}
										>
											{isSignUp ? "Login" : "Sign up"}
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
						) : (
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="reset_email" className="">
										Email
									</Label>
									<Input
										id="reset-email"
										type="email"
										required
										placeholder="name@example.com"
										value={resetEmail}
										onChange={(e) =>
											setResetEmail(e.target.value)
										}
									></Input>
								</div>
								<div className="grid gap-2">
									<Button
										type="submit"
										onClick={handleSendPasswordReset}
										className="font-normal"
									>
										Send Reset Link
									</Button>
									<Button
										type="button"
										variant="ghost"
										className="font-normal"
										onClick={() => setIsForget(false)}
									>
										Go Back to Login
									</Button>
								</div>
							</div>
						)}
					</form>
				</CardContent>
			</Card>
		</Container>
	);
}
