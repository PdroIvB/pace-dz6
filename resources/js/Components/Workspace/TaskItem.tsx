import { Task } from "@/types/task";
import { DraggableProvided } from "react-beautiful-dnd";

type TaskItemProps = {
    task: Task;
    provided: DraggableProvided;
}

function TaskItem({ task, provided }: TaskItemProps) {

    return (
        <>
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-00 
                                            hover:shadow-md transition-shadow duration-200 cursor-pointer m-4"
            >
                <div>
                    <div>{task.description}</div>
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
