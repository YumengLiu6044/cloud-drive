import { logo } from "@/assets/assets";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components//ui/card";

interface AuthCardProps {
  cardTitle: string;
  cardDescription: string;
  children: React.ReactNode;
}

export default function AuthCard({ cardTitle, cardDescription, children }: AuthCardProps) {
	return (
		<div className="h-full flex flex-col justify-center items-center">
			<div className="pb-3 flex flex-col items-center">
				<img src={logo} className="w-full max-w-[70px]"></img>
				<h1 className="text-primary text-3xl font-bold">Cloud Drive</h1>
			</div>
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{cardTitle}</CardTitle>
					<CardDescription>
						{cardDescription}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
          {children}
        </CardContent>
			</Card>
		</div>
	);
}
