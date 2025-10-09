import { motion, type HTMLMotionProps } from "motion/react";

export default function CollapsibleText({
	children,
	className,
  animate,
	isCollapsed,
}: HTMLMotionProps<"span"> & { isCollapsed: boolean }) {
	return (
		<motion.span
			animate={{
				opacity: isCollapsed ? 0 : 1,
				width: isCollapsed ? 0 : "fit-content",
        ...Object(animate)
			}}
			className={"text-nowrap pointer-events-none " + className}
		>
			{children}
		</motion.span>
	);
}
