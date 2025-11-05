import { API_BASE } from "@/constants";
import axiosClient from "./axiosClient";
import type { AxiosProgressEvent } from "axios";

export const DriveApi = {
	listContent: (parent_id: string) => {
		const endpoint = `${API_BASE.drive}/list-content/${parent_id}`;
		return axiosClient.get(endpoint);
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

	moveDirectory(childrenIds: string[], newParentId: string) {
		return axiosClient.post(API_BASE.drive + "/move-directory", {
			files: childrenIds,
			new_parent_id: newParentId,
		});
	},

	async downloadFiles(fileIds: string[]) {
		try {
			const response = await axiosClient.post(
				API_BASE.drive + "/download-files",
				{
					files: fileIds,
				},
				{
					responseType: "blob",
				}
			);
			const disposition: string =
				response.headers["content-disposition"] ?? "";
			let filename = "download.zip";
			const match = disposition.match(/.*filename=(.*)/);
			if (match && match[1]) {
				filename = match[1];
			}

			const blob = new Blob([response.data], { type: "application/zip" });
			const url = window.URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();

			window.URL.revokeObjectURL(url);
		} catch (e) {
			console.log(e)
		}
	},
};
