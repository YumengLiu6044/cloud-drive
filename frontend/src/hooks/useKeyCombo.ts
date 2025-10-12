import type { KeyCombo } from "@/type";
import { useEffect } from "react";

export default function useKeyCombo(keyCombo: KeyCombo, callback: () => void) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() !== keyCombo.key.toLowerCase()) return;

			if (
				!!keyCombo.ctrl !== e.ctrlKey ||
				!!keyCombo.meta !== e.metaKey ||
				!!keyCombo.shift !== e.shiftKey ||
				!!keyCombo.alt !== e.altKey
			) {
        return
			}

			e.preventDefault();
			callback();
		};

		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [keyCombo, callback]);
}
