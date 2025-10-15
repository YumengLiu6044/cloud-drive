import { API_BASE } from "@/constants";
import axiosClient from "./axiosClient";

export const DriveApi = {
	listContent: (parent_id: string) =>
		axiosClient.post(API_BASE.drive + "/list-content", {
			parent_id,
		}),
	createNewFolder: (parent_id: string, name: string) =>
		axiosClient.post(API_BASE.drive + "/create-folder", {
			parent_id,
			name,
		}),
};
