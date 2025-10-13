import { useEffect } from "react";

export default function useKeyDown(
	listenKey: string,
	callback: () => void,
	keyupCallback: () => void
) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault();
			if (e.key === listenKey) {
				callback();
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			e.preventDefault();

			if (e.key === listenKey) {
				keyupCallback();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [listenKey, callback, keyupCallback]);
}
