import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MoreVertical, Plus } from "lucide-react";
import { Column as ColumnType} from "@/types/column";
import { Head } from "@inertiajs/react";
import { Workspace } from "@/types/workspace";
import { useState } from "react";
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
    horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import TaskCard from "@/Components/Workspace/TaskCard";
import Column from "@/Components/Workspace/Column";

// Priority badge colors
const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
};

export default function Index ({auth, workspace}: PageProps & {workspace: Workspace}) {

    const [columns, setColumns] = useState<ColumnType[] | []>(workspace.columns ?? []);
    const [activeItem, setActiveItem] = useState<ColumnType | undefined>(undefined);

    const sensors = useSensors(useSensor(PointerSensor),useSensor(TouchSensor));

    const removeColumn = (id: number) => {
        setColumns((prevState) => {
            return prevState?.filter(column => column.id !== id).map((column, i) => ({...column, sequence: i+1}));
        });
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveItem(columns.find(item => item.sequence === active.id));
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeItem = columns.find(ex => ex.sequence === active.id);
        const overItem = columns.find(ex => ex.sequence === over.id);

        if (!activeItem || !overItem) {
            return;
        }

        const activeIndex = columns.findIndex(ex => ex.sequence === active.id);
        const overIndex = columns.findIndex(ex => ex.sequence === over.id);

        if (activeIndex !== overIndex) {
            setColumns(prev => {
                const updated = arrayMove(prev, activeIndex, overIndex).map((ex, i) => ({ ...ex, sequence: i + 1 }));

                return updated;
            });
        }

        setActiveItem(undefined);
    }

    const handleDragCancel = () => {
        setActiveItem(undefined);
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={workspace.name} />

            <div className="pb-12 pt-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {columns.length > 0 &&
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragCancel={handleDragCancel}
                            >
                                <SortableContext
                                    items={columns.map(column => column.sequence)}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    {columns.map((column) => (
                                        <Column key={column.id} column={column} removeColumn={removeColumn} />
                                    ))}
                                </SortableContext>
                                <DragOverlay adjustScale style={{transformOrigin: "0 0 "}}>
                                    {activeItem && (
                                        <Column column={activeItem} removeColumn={removeColumn} forceDragging={true} />
                                    )}
                                </DragOverlay>
                            </DndContext>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}