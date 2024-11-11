import { Task } from "@/types/task";
import { memo } from "react";
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import { Column } from "@/types/column";

type TaskListType = {
    column: Column;
};

const TaskList = ({ column }: TaskListType) => {
    return (
        <>
            <Droppable droppableId={`Column-${column.id}`} type="TASK">
                {(dropProvided, dropSnapshot) => (
                    <div
                        {...dropProvided.droppableProps}
                        className="bg-red-300 h-full"
                        ref={dropProvided.innerRef}
                    >
                        <Draggable key={index} draggableId={`Task-${task.id}`} index={index+1}>
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
                        {/* <InnerList
                            tasks={column.tasks ?? []}
                        /> */}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </>
    );
};

// function InnerList(props: any) {
//     const { tasks, dropProvided }: { tasks: Task[]; dropProvided: any } = props;
//     const title = props.title ? <div>{props.title}</div> : null;

//     return (
//         <div className="bg-green-300">
//             {title}
//             <div ref={dropProvided.innerRef} className="bg-blue-300">
//                 <InnerTaskList tasks={tasks} />
//                 {dropProvided.placeholder}
//             </div>
//         </div>
//     );
// }


const InnerList = ({ tasks }: { tasks: Task[] }) => {
    // const InnerTaskList = memo(function InnerTaskList(props) {
    // return (props as any).tasks.map((task: any, index: any) => (
    return tasks.map((task: Task, index: number) => (
        <Draggable key={index} draggableId={`Task-${task.id}`} index={index+1}>
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
};
// const InnerList = memo(function InnerTaskList({ tasks }: { tasks: Task[] }) {
//     // const InnerTaskList = memo(function InnerTaskList(props) {
//     // return (props as any).tasks.map((task: any, index: any) => (
//     return tasks.map((task: Task, index: number) => (
//         <Draggable key={task.id} draggableId={`Task-${task.id}`} index={index+1}>
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
// });

export default TaskList;
