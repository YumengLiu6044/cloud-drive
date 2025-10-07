import { loginBackground, logo } from "@/assets/assets";
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
import { useState } from "react";

export default function Login() {
	const [isForget, setIsForget] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);

	return (
		<div className="relative w-screen h-screen flex flex-col justify-center items-center p-5">
      <img src={loginBackground} className="absolute w-full h-full z-0"></img>
      <div className="pb-3 flex flex-col items-center z-10">
        <img src={logo} className="w-full max-w-[70px]"></img>
        <h1 className="text-primary text-3xl font-bold">Cloud Drive</h1>
      </div>
			<Card className="w-full max-w-md self-center z-10">
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
					{!isForget ? (
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="me@example.com"
									required
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									{!isSignUp && (
										<button
											className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
											onClick={() => setIsForget(true)}
										>
											Forgot your password?
										</button>
									)}
								</div>
								<Input
									id="password"
									type="password"
									autoComplete="new-password"
									required
									pattern=".{8,}"
									onFocus={() => setIsPasswordFocused(true)}
									onBlur={() => setIsPasswordFocused(false)}
								/>
								{isSignUp && isPasswordFocused && (
									<p className="w-full text-start text-muted-foreground text-xs">
										Minimum Length: 8
									</p>
								)}
							</div>
							{isSignUp && (
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="confirm_password">
											Confirm Password
										</Label>
									</div>
									<Input
										autoComplete="new-password"
										id="confirm_password"
										type="password"
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

								<p className="w-full text-center text-sm text-muted-foreground">
									{isSignUp
										? "Already have an account?"
										: "Don't have an account?"}{" "}
									<button
										className="text-medium text-primary hover:underline underline-offset-2"
										onClick={() =>
											setIsSignUp((prev) => !prev)
										}
									>
										{isSignUp ? "Login" : "Sign up"}
									</button>
								</p>
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
								></Input>
							</div>
							<div className="grid gap-2">
								<Button type="submit" className="font-normal">
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
				</CardContent>
			</Card>
		</div>
	);
}
