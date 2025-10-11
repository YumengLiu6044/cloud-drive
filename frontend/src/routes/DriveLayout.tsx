import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Outlet } from "react-router-dom";

export default function DriveLayout() {
	return (
		<ProtectedRoute>
			<div className="flex h-full">
				{/* Sidebar */}
				<Sidebar></Sidebar>

				{/* Content area */}
				<main className="w-full h-full">
					<Topbar></Topbar>
					<Outlet />
				</main>
			</div>
		</ProtectedRoute>
	);
}
