import axiosClient from "./axiosClient";

export const AuthApi = {
	login: (email: string, password: string) =>
		axiosClient.post("/login", { email, password }),
	register: (email: string, username: string, password: string) =>
		axiosClient.post("/login", { email, username, password }),
	forgotPassword: (email: string) =>
		axiosClient.post("/forgot-password", { email }),
	resetPassword: (newPassword: string, resetToken: string) =>
		axiosClient.post(
			"/reset-password",
			{
				new_password: newPassword,
			},
			{
				headers: {
					Authorization: `Bearer ${resetToken}`,
				},
			}
		),
};
