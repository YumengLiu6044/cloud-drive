import { UserApi } from "@/api/userApi";
import { SUB_ROUTES } from "@/constants";
import useAuthStore from "@/context/authStore";
import { useFileStore } from "@/context/fileStore";
import type { Directory } from "@/type";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function GoogleCallback() {
	const location = useLocation();
	const navigator = useNavigate();

	const queryParams = new URLSearchParams(location.search);

	const token = queryParams.get("token");
	const error = queryParams.get("error");

  const { login, setUsername, setEmail, setProfileImageId } = useAuthStore.getState();
	const { setDirectoryTree, setRootDirectory } = useFileStore.getState();

	useEffect(() => {
		if (error || !token) {
			toast.error(error || "Failed to login");
			navigator(SUB_ROUTES.login);
			return;
		}

		UserApi.getUser(token)
			.then((response) => {
				const body = response.data ?? {};
				const rootDirectory: Directory = {
					name: "My Drive",
					id: body.drive_root_id,
				};
				setDirectoryTree([rootDirectory]);
				setRootDirectory(rootDirectory);

        login(token);
				setUsername(body.username);
				setEmail(body.email);
				setProfileImageId(body.profile_image_id);
				navigator(SUB_ROUTES.drive.files);
			})
			.catch(() => {
				toast.error("Failed to login due to unknown error");
				navigator(SUB_ROUTES.login);
			});
	}, []);

	return <></>;
}
