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
import Trash from "./routes/Trash";
import { SUB_ROUTES } from "./constants";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Navigate to={SUB_ROUTES.login} replace />}
				/>
				<Route path={SUB_ROUTES.login} element={<Login />} />
				<Route
					path={SUB_ROUTES.drive.base}
					element={
						<ProtectedRoute>
							<DriveLayout />
						</ProtectedRoute>
					}
				>
					<Route
						index
						element={
							<Navigate
								to={SUB_ROUTES.drive.dashboard}
							></Navigate>
						}
					></Route>
					<Route
						path={SUB_ROUTES.drive.dashboard}
						element={<Dashboard />}
					/>
					<Route path={SUB_ROUTES.drive.files} element={<Files />} />
					<Route path={SUB_ROUTES.drive.trash} element={<Trash />} />
				</Route>
				<Route
					path={SUB_ROUTES.resetPassword}
					element={<ResetPassword />}
				></Route>
				<Route path={SUB_ROUTES.settings} element={<Settings />} />

				<Route
					path="*"
					element={<Navigate to={SUB_ROUTES.login} replace />}
				></Route>
			</Routes>
		</Router>
	);
}
