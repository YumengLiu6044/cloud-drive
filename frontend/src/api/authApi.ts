import { API_BASE } from "@/constants";
import axiosClient from "./axiosClient";

export const AuthApi = {
	login: (email: string, password: string) =>
		axiosClient.post(API_BASE.auth + "/login", { email, password }),
	register: (email: string, username: string, password: string) =>
		axiosClient.post(API_BASE.auth + "/register", {
			email,
			username,
			password,
		}),
	forgotPassword: (email: string) =>
		axiosClient.post(API_BASE.auth + "/forgot-password", { email }),
	resetPassword: (newPassword: string, resetToken: string) =>
		axiosClient.post(
			API_BASE.auth + "/reset-password",
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
