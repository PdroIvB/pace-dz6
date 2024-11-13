import { Task } from "@/types/task";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

type TaskItemProps = {
    task: Task;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
}

function TaskItem({ task, provided, snapshot }: TaskItemProps) {

    return (
        <>
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`rounded-lg shadow-sm border border-gray-00 p-2 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white ${snapshot.isDragging ? "border-2 border-black" : ""}`}
            >
                <div>
                    <div>{task.name}</div>
                    <div>
                        <small>{task.assignee?.name}</small>
                        <small>
                            id:
                            {task.id}
                        </small>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TaskItem;
