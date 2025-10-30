import type { DroppableProps } from "@/type";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({
	id,
	children,
	className,
	isOverClassName,
}: DroppableProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
	});

	return (
		<div
			ref={setNodeRef}
			className={`${className} ${isOver ? isOverClassName : ""}`}
		>
			{children}
		</div>
	);
}
