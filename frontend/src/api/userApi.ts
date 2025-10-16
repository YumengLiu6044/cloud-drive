import { API_BASE, BACKEND_URL } from "@/constants";
import axiosClient from "./axiosClient";
import useAuthStore from "@/context/authStore";

export const UserApi = {
	getUser: () => axiosClient.post(API_BASE.user),
	changeUserName: (newUserName: string) =>
		axiosClient.post(API_BASE.user + "/change-username", {
			new_name: newUserName,
		}),
	uploadProfilePic: (profilePic: File) => {
		const formData = new FormData()
		formData.append('file', profilePic)
		return axiosClient.post(API_BASE.user + "/upload-profile", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
	},
	getProfilePic(profileId: string) {
		const {token} = useAuthStore.getState()
		return BACKEND_URL + API_BASE.user + "/profile/" + profileId + `/?token=${token}`
	}
};
