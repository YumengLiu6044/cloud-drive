import { DriveApi } from "@/api/driveApi";
import { Progress } from "@/components/ui/progress";
import { useFileStore } from "@/context/fileStore";
import { useCallback, useState } from "react";
import type { FileWithPath } from "react-dropzone";
import { toast } from "sonner";

function UploadProgress({
	progressPercentage,
}: {
	progressPercentage: number;
}) {
	return (
		<div className="flex items-center gap-2">
			<Progress value={progressPercentage} className="w-full"></Progress>

			<span className="whitespace-nowrap">
				{progressPercentage.toFixed(0) + "%"}
			</span>
		</div>
	);
}

export default function useFileUpload() {
	const [isUploading, setIsUploading] = useState(false);
	const refreshFiles = useFileStore((state) => state.refreshFiles);

	const uploadFiles = useCallback(
		(files: FileWithPath[]) => {
			const directoryTree = useFileStore.getState().directoryTree;
			const currentDirectory = directoryTree.at(-1);
			if (!currentDirectory || isUploading) return;

			const uploadProgress: Record<string, number> = {};
			const totalUpload: Record<string, number> = {};

			setIsUploading(true);

			const toastId = toast.loading("Uploading files...", {
				description: <UploadProgress progressPercentage={0} />,
			});

			const promises = files.map((file) =>
				DriveApi.uploadFile(
					file,
					currentDirectory.id,
					(progressEvent) => {
						totalUpload[file.path ?? ""] = progressEvent.total ?? 0;
						uploadProgress[file.path ?? ""] = progressEvent.loaded;
						
						const uploadedBytes = Object.values(uploadProgress).reduce(
							(acc, bytes) => acc + bytes,
							0
						);
						const total = Object.values(totalUpload).reduce(
							(acc, bytes) => acc + bytes,
							0
						);
						const percentage =
							total === 0 ? 0 : (uploadedBytes / total) * 100;

						toast.loading("Uploading files...", {
							id: toastId,
							description: (
								<UploadProgress
									progressPercentage={percentage}
								/>
							),
						});
					}
				)
			);
			Promise.allSettled(promises)
				.then(() => {
					console.log("Done")
					toast.success("Files uploaded successfully!", {
						id: toastId,
						description: undefined,
					});
					refreshFiles();
				})
				.catch(() =>
					toast.error("Failed to upload files.", { id: toastId })
				)
				.finally(() => setIsUploading(false));
		},
		[isUploading]
	);

	return { uploadFiles };
}
