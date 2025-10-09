import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DriveLayout() {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen">
				{/* Sidebar */}
				<Sidebar></Sidebar>

				{/* Content area */}
				<main className="flex-1 p-6">
					<Outlet /> {/* Renders subroute content */}
				</main>
			</div>
		</ProtectedRoute>
	);
}
