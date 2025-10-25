import { API_BASE } from "@/constants";
import axiosClient from "./axiosClient";
import type { AxiosProgressEvent } from "axios";

export const DriveApi = {
	listContent: (parent_id: string) => {
		const endpoint = `${API_BASE.drive}/list-content/${parent_id}`
		return axiosClient.get(endpoint)
	},
	createNewFolder: (parent_id: string, name: string) =>
		axiosClient.post(API_BASE.drive + "/create-folder", {
			parent_id,
			name,
		}),
	moveToTrash: (files: string[]) =>
		axiosClient.post(API_BASE.drive + "/move-to-trash", {
			files,
		}),
	deleteFromTrash: (files: string[]) =>
		axiosClient.post(API_BASE.drive + "/delete-from-trash", {
			files,
		}),
	listTrashContent: () =>
		axiosClient.get(API_BASE.drive + "/list-trash-content"),

	uploadFile: (
		file: File,
		parentId: string,
		uploadProgress?: (_: AxiosProgressEvent) => void
	) => {
		const form = new FormData();
		form.append("file", file);

		const encodedFilename = encodeURIComponent(file.name);
		const endpoint = `${API_BASE.drive}/upload-file/${parentId}?file_name=${encodedFilename}`;

		return axiosClient.post(endpoint, form, {
			headers: {
				"Content-Type": file.type || "application/octet-stream",
			},
			onUploadProgress: uploadProgress,
		});
	},
};
