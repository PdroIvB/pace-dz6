import { Task } from "@/types/task";
import { memo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";

const TaskList = (props: any) => {
    const {
        internalScroll,
        isCombineEnabled,
        listId = "LIST",
        listType,
        tasks,
        useClone,
    } = props;

    return (
        <>
            <Droppable
                droppableId={listId}
                // droppableId="TaskList"
                type={listType}
                // ignoreContainerClipping={ignoreContainerClipping}
                // isDropDisabled={isDropDisabled}
                isCombineEnabled={isCombineEnabled}
                // renderClone={
                //     useClone
                //     ? (provided, snapshot, descriptor) => (
                //         <TaskItem
                //             task={tasks[descriptor.source.index]}
                //             provided={provided}
                //             isDragging={snapshot.isDragging}
                //             isClone
                //         />
                //         )
                //     : null
                // }
            >
                {(dropProvided, dropSnapshot) => (
                    <div
                        // style={style}
                        {...dropProvided.droppableProps}
                        className="bg-red-300 h-full"
                    >
                        {internalScroll ? (
                            <div className="max-h-svh">
                                <InnerList
                                    tasks={tasks}
                                    dropProvided={dropProvided}
                                />
                            </div>
                        ) : (
                            <InnerList
                                tasks={tasks}
                                dropProvided={dropProvided}
                            />
                        )}
                    </div>
                )}
            </Droppable>
        </>
    );
};

function InnerList(props: any) {
    const { tasks, dropProvided }: { tasks: Task[]; dropProvided: any } = props;
    const title = props.title ? <div>{props.title}</div> : null;

    return (
        <div className="bg-green-300">
            {title}
            <div ref={dropProvided.innerRef} className="bg-blue-300">
                <InnerTaskList tasks={tasks} />
                {dropProvided.placeholder}
            </div>
        </div>
    );
}

// const InnerTaskList = ({ tasks }: { tasks: Task[] }) => {
//     // const InnerTaskList = memo(function InnerTaskList(props) {
//     // return (props as any).tasks.map((task: any, index: any) => (
//     return tasks.map((task: any, index: any) => (
//         <Draggable key={task.id} draggableId={`TaskID${task.id}`} index={index}>
//             {(dragProvided, dragSnapshot) => (
//                 <TaskItem
//                     key={task.id}
//                     task={task}
//                     isDragging={dragSnapshot.isDragging}
//                     isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
//                     provided={dragProvided}
//                 />
//             )}
//         </Draggable>
//     ));
// };
const InnerTaskList = memo(function InnerTaskList({
    tasks,
}: {
    tasks: Task[];
}) {
    // const InnerTaskList = memo(function InnerTaskList(props) {
    // return (props as any).tasks.map((task: any, index: any) => (
    return tasks.map((task: any, index: any) => (
        <Draggable key={task.id} draggableId={`TaskID${task.id}`} index={index}>
            {(dragProvided, dragSnapshot) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isDragging={dragSnapshot.isDragging}
                    isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                    provided={dragProvided}
                />
            )}
        </Draggable>
    ));
});

export default TaskList;
