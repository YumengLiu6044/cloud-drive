import useAuthStore from "@/context/authStore";
import axios from "axios";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
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
		if (error.response?.status == 401) {
			const { setToken } = useAuthStore.getState();
			setToken(null);
			window.location.href = "/login";
		}
    return Promise.reject(error)
	}
);
export default axiosClient;
