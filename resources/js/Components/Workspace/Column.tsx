import { Draggable, Droppable } from "react-beautiful-dnd";
import { MoreVertical } from "lucide-react";
import { Column as ColumnType } from "@/types/column";
import TaskItem from "./TaskItem";

type ColumnDragProps = {
    column: ColumnType;
    index: number;
};

const Column = ({ column, index }: ColumnDragProps) => {
    return (
        <>
            <Draggable draggableId={`Column-${column.id}`} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex-shrink-0 w-80 bg-gray-200 rounded-lg p-4"
                    >
                        {/* Header do card */}
                        <div
                            className="flex justify-between items-center mb-4 pb-4 border-b border-black"
                            {...provided.dragHandleProps}
                        >
                            <h2 className="font-semibold text-gray-700">
                                {column.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    {column.tasks?.length ?? 0}
                                </span>
                                <button className="p-1 hover:bg-gray-200 rounded">
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <Droppable
                            droppableId={`Column-${column.id}`}
                            type="TASK"
                        >
                            {(dropProvided, dropSnapshot) => (
                                <div
                                    {...dropProvided.droppableProps}
                                    className="h-full"
                                    ref={dropProvided.innerRef}
                                >
                                    {column.tasks?.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={`Task-${task.id}`}
                                            index={index}
                                        >
                                            {(dragProvided, dragSnapshot) => (
                                                <TaskItem
                                                    key={task.id}
                                                    task={task}
                                                    provided={dragProvided}
                                                />
                                            )}
                                        </Draggable>
                                    ))}

                                    {/* <InnerList
                                        tasks={column.tasks ?? []}
                                    /> */}
                                    {dropProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        {/* <TaskList column={column} /> */}
                    </div>
                )}
            </Draggable>
        </>
    );
};

export default Column;
