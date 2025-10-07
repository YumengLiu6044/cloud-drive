import { useState } from "react";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
	password: string;
	setPassword: (password: string) => void;
	setIsPasswordFocused: (isFocused: boolean) => void;
	autoComplete?: string;
}

export default function PasswordField({
	password,
	setPassword,
	setIsPasswordFocused,
	autoComplete = "current-password",
}: PasswordFieldProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="w-full relative group">
			<Input
				id="password"
				type={showPassword ? "text" : "password"}
				autoComplete={autoComplete}
				required
				pattern=".{8,}"
				onFocus={() => setIsPasswordFocused(true)}
				onBlur={() => setIsPasswordFocused(false)}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button
				type="button"
				onClick={() => setShowPassword(!showPassword)}
				className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground group-hover:opacity-100 opacity-0 transition"
			>
				{!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
			</button>
		</div>
	);
}
