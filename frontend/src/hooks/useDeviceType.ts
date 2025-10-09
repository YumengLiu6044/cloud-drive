import { DEVICE_TYPES, TAILWIND_BREAKPOINTS } from "@/constants";
import { useState, useEffect } from "react";

export function useDeviceType() {
	const [deviceType, setDeviceType] = useState<keyof typeof DEVICE_TYPES>(
		getDeviceType(window.innerWidth)
	);

	function getDeviceType(width: number) {
		if (width < TAILWIND_BREAKPOINTS.md) return DEVICE_TYPES.mobile;
		if (width < TAILWIND_BREAKPOINTS.lg) return DEVICE_TYPES.tablet;
		return DEVICE_TYPES.desktop;
	}

	function handleResize() {
    const newDeviceType = getDeviceType(window.innerWidth)
		setDeviceType(newDeviceType);
	}

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return {
		type: deviceType,
		isMobile: deviceType === DEVICE_TYPES.mobile,
		isDesktop: deviceType === DEVICE_TYPES.desktop,
		isTablet: deviceType === DEVICE_TYPES.tablet,
	};
}
