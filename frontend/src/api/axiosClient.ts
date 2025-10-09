import {
	AUTH_API_BASE,
	BACKEND_URL,
	IGNORE_401_ROUTES,
	SUB_ROUTES,
} from "@/constants";
import useAuthStore from "@/context/authStore";
import axios from "axios";
import { toast } from "sonner";

const axiosClient = axios.create({
	baseURL: BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use((config) => {
	const { token } = useAuthStore.getState();
	if (token && !config.headers.Authorization) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const { status = "", data = {} } = error.response || {};
		const detail = data.detail;
		const requestUrl = error.config?.url ?? "";

		if (
			status === 401 &&
			IGNORE_401_ROUTES.every(
				(route) => !requestUrl.includes(AUTH_API_BASE + route)
			)
		) {
			const { logout } = useAuthStore.getState();
			logout();
			window.location.href = SUB_ROUTES.login;
		}

		let message = "An unexpected error has occured";

		if (typeof detail === "string") {
			message = detail;
		} else if (Array.isArray(detail) && detail.length > 0) {
			message = detail[0].msg || "Invalid input data";
		} else {
			message = "An unexpected error has occurred";
		}
		toast.error(message);
		return Promise.reject(new Error(message));
	}
);
export default axiosClient;
