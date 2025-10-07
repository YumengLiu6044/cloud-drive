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

export default function Login() {
	const [isForget, setIsForget] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);

	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [resetEmail, setResetEmail] = useState("");

	const handleSendPasswordReset = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (!resetEmail) {
				toast.error("Please enter your email");
				return;
			}

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
				});
		},
		[resetEmail]
	);

	return (
		<Container className="flex flex-col justify-center items-center">
			<div className="pb-3 flex flex-col items-center z-10">
				<img src={logo} className="w-full max-w-[70px]"></img>
				<h1 className="text-primary text-3xl font-bold">Cloud Drive</h1>
			</div>
			<Card className="w-full max-w-md z-10">
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
												placeholder="optional"
												autoComplete="username"
												value={username}
												onChange={(e) =>
													setUsername(e.target.value)
												}
											/>
										</div>
									)}
								</div>

								<div className="grid gap-2">
									<div className="flex justify-between">
										<Label htmlFor="password">Password</Label>
										{!isSignUp && (
											<button
												className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
												onClick={() => setIsForget(true)}
												type="button"
											>
												Forgot your password?
											</button>
										)}
									</div>

									<Input
										id="password"
										type="password"
										autoComplete="current-password"
										required
										pattern=".{8,}"
										onFocus={() =>
											setIsPasswordFocused(true)
										}
										onBlur={() =>
											setIsPasswordFocused(false)
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
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
									>
										{isSignUp ? "Sign Up" : "Login"}
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
