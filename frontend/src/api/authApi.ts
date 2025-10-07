import { AUTH_API_BASE } from "@/constants";
import axiosClient from "./axiosClient";

export const AuthApi = {
	login: (email: string, password: string) =>
		axiosClient.post(AUTH_API_BASE + "/login", { email, password }),
	register: (email: string, username: string, password: string) =>
		axiosClient.post(AUTH_API_BASE + "/register", {
			email,
			username,
			password,
		}),
	forgotPassword: (email: string) =>
		axiosClient.post(AUTH_API_BASE + "/forgot-password", { email }),
	resetPassword: (newPassword: string, resetToken: string) =>
		axiosClient.post(
			AUTH_API_BASE + "/reset-password",
			{
				new_password: newPassword,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${resetToken}`,
				},
			}
		),
};
