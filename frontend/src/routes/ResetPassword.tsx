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
import { SUB_ROUTES } from "@/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const navigator = useNavigate();
	const onClickBacktoLogin = () => navigator(SUB_ROUTES.login);

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

						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							required
							pattern=".{8,}"
							onFocus={() => setIsPasswordFocused(true)}
							onBlur={() => setIsPasswordFocused(false)}
						/>
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
							required
						/>
					</div>

					<div className="w-full grid gap-2">
						<Button type="submit" className="font-normal">
							Reset Password
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
