import {
	AUTH_API_BASE,
	BACKEND_URL,
	IGNORE_401_ROUTES,
	SUB_ROUTES,
} from "@/constants";
import useAuthStore from "@/context/authStore";
import axios from "axios";

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
		const status = error.response?.status;
		const requestUrl = error.config?.url ?? "";

		if (
			status === 401 &&
			IGNORE_401_ROUTES.every(
				(route) => !requestUrl.includes(AUTH_API_BASE + route)
			)
		) {
			const { setToken } = useAuthStore.getState();
			setToken(null);
			window.location.href = SUB_ROUTES.login;
		}
		return Promise.reject(error);
	}
);
export default axiosClient;
