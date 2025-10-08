import { loginBackground } from "@/assets/assets";
import { Outlet } from "react-router-dom";

interface ContainerProps {
	className?: string;
}
export default function AppContainer({ className }: ContainerProps) {
	return (
		<div className={"relative w-screen h-screen " + className}>
			<img
				src={loginBackground}
				className="absolute w-full h-full -z-10"
			></img>
			<Outlet></Outlet>
		</div>
	);
}
