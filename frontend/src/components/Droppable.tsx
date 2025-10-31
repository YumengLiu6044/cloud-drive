import type { DroppableProps } from "@/type";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({
	id,
	children,
	className,
	isOverClassName,
  accepts,
}: DroppableProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
    data: { accepts }
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
