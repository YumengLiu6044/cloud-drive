import { UserApi } from "@/api/userApi";
import { SUB_ROUTES } from "@/constants";
import useAuthStore from "@/context/authStore";
import { useFileStore } from "@/context/fileStore";
import type { Directory } from "@/type";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginCallback() {
	const navigator = useNavigate();
	const { token, setUsername, setEmail } = useAuthStore.getState();
	const { setCurrentDirectory, setRootDirectory } = useFileStore.getState();

	if (!token) return;

	useEffect(() => {
		UserApi.getUser()
			.then((response) => {
				const body = response.data ?? {};
				const rootDirectory: Directory = {
					name: "My Drive",
					id: body.drive_root_id,
				};
				setCurrentDirectory(rootDirectory);
				setRootDirectory(rootDirectory);

				setUsername(body.username);
				setEmail(body.email);
				navigator(SUB_ROUTES.drive.base);
			})
			.catch(() => {
				toast.error("Failed to login due to unknown error");
				navigator(SUB_ROUTES.login);
			});
	}, []);

	return <></>;
}
