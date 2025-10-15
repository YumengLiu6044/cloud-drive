import { API_BASE } from "@/constants";
import axiosClient from "./axiosClient";

export const UserApi = {
	getUser: () => axiosClient.post(API_BASE.user),
	changeUserName: (newUserName: string) =>
		axiosClient.post(API_BASE.user + "/change-username", {
			new_name: newUserName,
		}),
};
