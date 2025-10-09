import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { SUB_ROUTES } from "@/constants";
import useAuthStore from "@/context/authStore";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function DriveLayout() {
	const navigator = useNavigate();
	const { setToken } = useAuthStore();

	const handleLogout = () => {
		navigator(SUB_ROUTES.login);
		setToken(null);
	};

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
