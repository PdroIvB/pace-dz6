import { Draggable } from "react-beautiful-dnd";
import TaskList from "./TaskList";
import { MoreVertical } from "lucide-react";

const Column1 = (props: any) => {

    const column = props.column;

    return (
        <>
            <Draggable draggableId={`ColumnID${props.id}`} index={props.index}>
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

                        <TaskList
                            listId={props.id}
                            listType="TASK"
                            tasks={props.tasks}
                            internalScroll={props.isScrollable}
                            isCombineEnabled={Boolean(props.isCombineEnabled)}
                            useClone={Boolean(props.useClone)}
                        />
                    </div>
                )}
            </Draggable>
        </>
    );
};

export default Column1;
