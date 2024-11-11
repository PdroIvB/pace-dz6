import { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";
import {
    closestCenter,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DndContext,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskCard from "./TaskCard";
import { Task } from "@/types/task";
import { Column as ColumnType } from "@/types/column";

type ColumnProps = {
    column: ColumnType;
    removeColumn: (id: number) => void;
    forceDragging?: boolean;
};

export default function Column({
    column,
    removeColumn,
    forceDragging,
}: ColumnProps) {

    const [tasks, setTasks] = useState<Task[] | []>(column.tasks ?? []);
    const [activeItem, setActiveItem] = useState<Task | undefined>(undefined);

    const sensors = useSensors(useSensor(PointerSensor),useSensor(TouchSensor));

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveItem(tasks.find(item => item.sequence === active.id));
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeItem = tasks.find(ex => ex.sequence === active.id);
        const overItem = tasks.find(ex => ex.sequence === over.id);

        if (!activeItem || !overItem) {
            return;
        }

        const activeIndex = tasks.findIndex(ex => ex.sequence === active.id);
        const overIndex = tasks.findIndex(ex => ex.sequence === over.id);

        if (activeIndex !== overIndex) {
            setTasks(prev => {
                const updated = arrayMove(prev, activeIndex, overIndex).map((ex, i) => ({ ...ex, sequence: i + 1 }));

                return updated;
            });
        }

        setActiveItem(undefined);
    }

    const handleDragCancel = () => {
        setActiveItem(undefined);
    }

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({
        id: column.sequence,
    });

    const parentStyles = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? "0.4" : "1",
        lineHeight: "4",
    };

    const draggableStyles = {
        cursor: isDragging || forceDragging ? "grabbing" : "grab",
    };

    return (
        <div
            className="flex-shrink-0 w-80 bg-gray-200 rounded-lg p-4"
            ref={setNodeRef}
            style={parentStyles}
        >
            {/* Column Header */}
            <div
                className="flex justify-between items-center mb-4"
                ref={setActivatorNodeRef}
                style={draggableStyles}
                {...attributes}
                {...listeners}
            >
                <h2 className="font-semibold text-gray-700">{column.name}</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {column.tasks?.length ?? 0}
                    </span>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-3">
                {tasks.length > 0 &&
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={tasks.map(task => task.sequence)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </SortableContext>
                        <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
                            {activeItem && (
                                <TaskCard task={activeItem} />
                            )}
                        </DragOverlay>
                    </DndContext>
                }
                <button
                    className="flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-300 
                                                rounded transition-colors duration-200 w-full"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Task</span>
                </button>
            </div>
        </div>
    );
}
