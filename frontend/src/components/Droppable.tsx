import type { DroppableProps } from "@/type";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({
	id,
	children,
  accepts,
}: DroppableProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
    data: { accepts }
	});

	return (
		<div
			ref={setNodeRef}
		>
			{typeof children === "function" ? children(isOver) : children}
		</div>
	);
}
