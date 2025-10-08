import { logo } from "@/assets/assets";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components//ui/card";
import { AnimatePresence, motion } from "motion/react";

interface AuthCardProps {
	cardTitle: string;
	cardDescription: string;
	children: React.ReactNode;
	key: string;
	isVisible: boolean;
}

const secondaryState = { opacity: 0, y: -20 };
const mainState = { opacity: 1, y: 0 };

export default function AuthCard({
	cardTitle,
	cardDescription,
	children,
	key,
	isVisible,
}: AuthCardProps) {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={secondaryState}
					animate={mainState}
					exit={secondaryState}
					transition={{ duration: 0.5 }}
					key={key}
					className="h-full flex flex-col justify-center items-center"
				>
					<div className="pb-3 flex flex-col items-center">
						<img src={logo} className="w-full max-w-[70px]"></img>
						<h1 className="text-primary text-3xl font-bold">
							Cloud Drive
						</h1>
					</div>
					<Card className="w-full max-w-md">
						<CardHeader>
							<CardTitle>{cardTitle}</CardTitle>
							<CardDescription>{cardDescription}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-5">
							{children}
						</CardContent>
					</Card>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
