import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./routes/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import DriveLayout from "./routes/DriveLayout";
import Dashboard from "./routes/Dashboard";
import Files from "./routes/Files";
import Settings from "./routes/Settings";
import ResetPassword from "./routes/ResetPassword";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="/drive"
					element={
						<ProtectedRoute>
							<DriveLayout />
						</ProtectedRoute>
					}
				>
					<Route
						index
						element={<Navigate to="dashboard"></Navigate>}
					></Route>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="files" element={<Files />} />
					<Route path="settings" element={<Settings />} />
				</Route>
				<Route path="/reset-password" element={<ResetPassword/>}></Route>
				<Route
					path="*"
					element={<Navigate to="/login" replace />}
				></Route>
			</Routes>
		</Router>
	);
}
