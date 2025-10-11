import { loginBackground } from "@/assets/assets";
import type { CustomNode } from "@/type";
import { Outlet } from "react-router-dom";

export default function AppContainer({ className }: CustomNode) {
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
