import { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskCardProps = {
    task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({
        id: task.sequence,
    });

    const parentStyles = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? "0.4" : "1",
        lineHeight: "4",
    };

    // const draggableStyles = {
    //     cursor: isDragging || forceDragging ? "grabbing" : "grab",
    // };

    return (
        <div
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-00 
                                            hover:shadow-md transition-shadow duration-200 cursor-pointer"
            // ref={setActivatorNodeRef}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <h3 className="font-medium text-gray-800 mb-2">{task.name}</h3>
            {/* <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                        </span>
                                        <span className="text-sm text-gray-500">Due {task.dueDate}</span>
                                    </div> */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                            {task.assignee?.name[0] ?? ""}
                        </span>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                        {task.assignee?.name}
                    </span>
                </div>
            </div>
        </div>
    );
}
