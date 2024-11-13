import { Task } from "@/types/task";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

type TaskItemProps = {
    task: Task;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
};

function TaskItem({ task, provided, snapshot }: TaskItemProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && openModal) {
                setOpenModal(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (modalRef.current && !modalRef.current.contains(target)) {
                setOpenModal(false);
            }
        };

        if (openModal) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openModal, setOpenModal]);

    return (
        <>
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`rounded-lg shadow-sm border border-gray-00 p-2 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white ${
                    snapshot.isDragging ? "border-2 border-black" : ""
                }`}
                onClick={() => setOpenModal(true)}
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
            {openModal && (
                <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen items-center justify-center bg-gray-800 bg-opacity-50">
                    <div
                        className="w-1/2 h-1/2 bg-gray-200 rounded-xl flex flex-col items-center justify-start animate-scaleIn overflow-y-auto p-5 overflow-x-hidden"
                        ref={modalRef}
                    >
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Add Description
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpenModal(false)}
                                className="text-gray-400 hover:text-gray-600 rounded-lg  hover:bg-gray-100 transition-colors w-7 h-7 flex justify-center items-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* <div className="flex  bg-red-300">
                            <div className="flex bg-green-300 items-center justify-between">
                                <span className="font-medium text-dark-200">
                                    {task.name}
                                </span>
                                <X
                                    className="hover:text-icon-dark right-3 top-3 ml-3 h-8 w-8 cursor-pointer rounded bg-icon p-0.5 text-icon-close hover:bg-opacity-50"
                                    onClick={() => setOpenModal(false)}
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </>
    );
}

export default TaskItem;
