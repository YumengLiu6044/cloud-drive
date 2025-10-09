import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./routes/Login";
import DriveLayout from "./routes/DriveLayout";
import Files from "./routes/Files";
import Settings from "./routes/Settings";
import ResetPassword from "./routes/ResetPassword";
import Trash from "./routes/Trash";
import { SUB_ROUTES } from "./constants";
import Register from "./routes/Register";
import AppContainer from "./components/Container";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AppContainer />}>
					<Route
						index
						element={
							<Navigate to={SUB_ROUTES.login} replace></Navigate>
						}
					></Route>
					<Route path={SUB_ROUTES.login} element={<Login />} />
					<Route path={SUB_ROUTES.register} element={<Register />} />
					<Route
						path={SUB_ROUTES.drive.base}
						element={<DriveLayout />}
					>
						<Route
							index
							element={
								<Navigate
									to={SUB_ROUTES.drive.files}
								></Navigate>
							}
						></Route>
						<Route
							path={SUB_ROUTES.drive.files}
							element={<Files />}
						/>
						<Route
							path={SUB_ROUTES.drive.trash}
							element={<Trash />}
						/>
						<Route
							path={SUB_ROUTES.drive.settings}
							element={<Settings />}
						/>
						<Route
							path="*"
							element={
								<Navigate
									to={SUB_ROUTES.drive.files}
									replace
								></Navigate>
							}
						></Route>
					</Route>
					<Route
						path={SUB_ROUTES.resetPassword}
						element={<ResetPassword />}
					></Route>
				</Route>
			</Routes>
		</Router>
	);
}
