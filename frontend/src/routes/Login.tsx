import { AuthApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import PasswordField from "@/components/PasswordField";
import { SUB_ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/context/authStore";
import { LoaderCircle } from "lucide-react";
import AuthCard from "@/components/AuthCard";

export default function Login() {
	const [isForget, setIsForget] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [resetEmail, setResetEmail] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(true);

	const navigator = useNavigate();
	const { login } = useAuthStore();

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
			AuthApi.login(email, password)
				.then((response) => {
					toast.success("Login successful");
					login(response.data.access_token);
					setIsVisible(false);
					setTimeout(() => {
						navigator(SUB_ROUTES.loginCallback);
					}, 500);
				})
				.finally(() => setIsLoading(false));
		},
		[email, password, navigator]
	);

	return (
		<AuthCard
			cardTitle="Welcome to Cloud Drive"
			cardDescription="Enter your email below to login to your account"
			cardKey="login-card"
			isVisible={isVisible}
		>
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
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<div className="flex justify-between">
								<Label htmlFor="password">Password</Label>

								<button
									className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
									onClick={() => setIsForget(true)}
									type="button"
								>
									Forgot your password?
								</button>
							</div>

							<PasswordField
								setPassword={setPassword}
								password={password}
								autoComplete="current-password"
							></PasswordField>
						</div>
						<div className="flex flex-col gap-2">
							<Button
								type="submit"
								className="w-full font-normal"
								disabled={isLoading}
								onClick={handleFormSubmit}
							>
								Login
								{isLoading && (
									<LoaderCircle className="animate-spin"></LoaderCircle>
								)}
							</Button>

							<div className="w-full text-center text-sm text-muted-foreground">
								Don't have an account?{" "}
								<button
									className="text-medium text-primary hover:underline underline-offset-2"
									type="button"
									onClick={() =>
										navigator(SUB_ROUTES.register)
									}
								>
									Sign up
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
								onChange={(e) => setResetEmail(e.target.value)}
							></Input>
						</div>
						<div className="grid gap-2">
							<Button
								type="submit"
								onClick={handleSendPasswordReset}
								className="font-normal"
								disabled={isLoading}
							>
								Send Reset Link
								{isLoading && (
									<LoaderCircle className="animate-spin"></LoaderCircle>
								)}
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
		</AuthCard>
	);
}
