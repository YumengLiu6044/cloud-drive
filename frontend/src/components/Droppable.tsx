import type { DroppableProps } from "@/type";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({
	id,
	children,
  accepts,
	type
}: DroppableProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
    data: { accepts, type }
	});

	return (
		<div
			ref={setNodeRef}
		>
			{typeof children === "function" ? children(isOver, setNodeRef) : children}
		</div>
	);
}
