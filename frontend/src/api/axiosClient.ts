import { BACKEND_URL } from "@/constants";
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
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

		if (status === 401 && !requestUrl.includes("/auth/reset-password")) {
			const { setToken } = useAuthStore.getState();
			setToken(null);
			window.location.href = "/login";
		}
    return Promise.reject(error)
	}
);
export default axiosClient;
