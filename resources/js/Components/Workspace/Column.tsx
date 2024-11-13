import { Draggable, Droppable } from "react-beautiful-dnd";
import { MoreVertical, Plus } from "lucide-react";
import { Column as ColumnType } from "@/types/column";
import TaskItem from "./TaskItem";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TaskCreateForm from "../Task/CreateForm";
import { useAxios } from "@/hooks/useAxios";
import { createColumnType } from "@/Pages/Authenticated/Workspace/Index";
import ColumnDropdown from "../Column/ColumnDropdown";
import EditForm from "../Column/EditForm";
import useToast from "@/hooks/useToast";

type ColumnDragProps = {
    column: ColumnType;
    index: number;
    setColumns: React.Dispatch<React.SetStateAction<[] | ColumnType[]>>;
};

const schema = z.object({
    name: z.string().min(3, "O nome deve ter pelos menos 3 caracteres!"),
});

export type createTaskType = z.infer<typeof schema>;

const Column = ({ column, index, setColumns }: ColumnDragProps) => {
    const [creatingTask, setCreatingTask] = useState<boolean>(false);
    const [openColumnDropdown, setOpenColumnDropdrown] =
        useState<boolean>(false);
    const [editingColumn, setEditingColumn] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null);
    const { axiosInstance } = useAxios();
    const showToast = useToast();

    const { handleSubmit, register, formState, reset, setError } =
        useForm<createTaskType>({
            resolver: zodResolver(schema),
        });

    const {
        handleSubmit: handleColumn,
        register: registerColumn,
        formState: formColumn,
        reset: resetColumn,
        setError: setErrorColumn,
        setValue,
    } = useForm<createColumnType>({
        resolver: zodResolver(schema),
    });

    const createTask = (data: createTaskType) => {
        axiosInstance
            .post("/task", { ...data, column_id: column.id })
            .then(({ data }) => {
                if (!column.tasks) {
                    column.tasks = [data.task];
                } else {
                    column.tasks?.push(data.task);
                }
                setCreatingTask(false);
            })
            .catch((errors) => {
                Object.keys(errors).forEach((field: string) => {
                    setError(field as keyof createTaskType, {
                        type: "manual",
                        message: errors[field],
                    });
                });
            });
    };

    const editColumn = (data: createColumnType) => {
        axiosInstance
            .put(`/column/${column.id}`, data)
            .then(({ data }) => {
                setColumns((prev) =>
                    prev.map((item) =>
                        item.id === column.id
                            ? { ...column, name: data.column.name }
                            : item
                    )
                );
                setEditingColumn(false);
            })
            .catch((errors) => {
                Object.keys(errors).forEach((field: string) => {
                    setError(field as keyof createTaskType, {
                        type: "manual",
                        message: errors[field],
                    });
                });
            });
    };

    const deleteColumn = () => {
        axiosInstance
            .delete(`/column/${column.id}`)
            .then(({ data }) => {
                setColumns((prev) =>
                    prev.filter((item) => item.id !== column.id)
                );
                showToast(data.message, "success");
            })
            .catch(() => showToast("Falha ao deletar lista", "error"));
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && editingColumn) {
                setEditingColumn(false);
                resetColumn();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (formRef.current && !formRef.current.contains(target)) {
                setEditingColumn(false);
                resetColumn();
            }
        };

        if (editingColumn) {
            setValue("name", column.name);
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            resetColumn();
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingColumn, setEditingColumn]);

    return (
        <div className="h-fit">
            <Draggable draggableId={`Column-${column.id}`} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex-shrink-0 w-80 bg-gray-200 rounded-lg ${
                            snapshot.isDragging
                                ? "border-2 border-black"
                                : ""
                        }`}
                    >
                        {/* Header do card */}
                        <div
                            className="flex justify-between items-center border-b border-gray-400 mx-3 mb-1 py-3"
                            {...provided.dragHandleProps}
                        >
                            <EditForm
                                editingColumn={editingColumn}
                                setEditingColumn={setEditingColumn}
                                column={column}
                                formState={formColumn}
                                handleSubmit={handleColumn}
                                submit={editColumn}
                                register={registerColumn}
                                reset={resetColumn}
                                ref={formRef}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 ml-2">
                                    {column.tasks?.length ?? 0}
                                </span>
                                <button
                                    className="relative p-1 hover:bg-gray-300 rounded"
                                    onClick={() =>
                                        setOpenColumnDropdrown((prev) => !prev)
                                    }
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                    <ColumnDropdown
                                        openDropdown={openColumnDropdown}
                                        setOpenDropdown={setOpenColumnDropdrown}
                                        setCreatingTask={setCreatingTask}
                                        setEditingColumn={setEditingColumn}
                                        deleteColumn={deleteColumn}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="p-2 flex flex-col gap-2">
                            <Droppable
                                droppableId={`Column-${column.id}`}
                                type="TASK"
                            >
                                {(dropProvided, dropSnapshot) => (
                                    <div
                                        {...dropProvided.droppableProps}
                                        className={`${
                                            dropSnapshot.isDraggingOver
                                                ? "bg-green-200"
                                                : ""
                                        } overflow-y-scroll h-[calc(70svh-100px)] scrollbar-thin scrollbar-thumb-slate-200 transition-colors`}
                                        ref={dropProvided.innerRef}
                                    >
                                        <div className="h-fit flex flex-col gap-4 mr-1">
                                            {column.tasks?.map(
                                                (task, index) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={`Task-${task.id}`}
                                                        index={index}
                                                    >
                                                        {(
                                                            dragProvided,
                                                            dragSnapshot
                                                        ) => (
                                                            <TaskItem
                                                                key={task.id}
                                                                task={task}
                                                                provided={
                                                                    dragProvided
                                                                }
                                                                snapshot={
                                                                    dragSnapshot
                                                                }
                                                            />
                                                        )}
                                                    </Draggable>
                                                )
                                            )}
                                        </div>
                                        {dropProvided.placeholder}
                                        <TaskCreateForm
                                            creatingTask={creatingTask}
                                            setCreatingTask={setCreatingTask}
                                            handleSubmit={handleSubmit}
                                            formState={formState}
                                            register={register}
                                            submit={createTask}
                                            reset={reset}
                                        />
                                    </div>
                                )}
                            </Droppable>
                            <button
                                onClick={() => setCreatingTask((prev) => !prev)}
                                className=" bg-gray-200 max-h-fit min-w-fit rounded-b-xl p-2 bg-opacity-40 hover:bg-gray-400 hover:bg-opacity-40 cursor-pointer transition-colors duration-200"
                            >
                                <div className="flex gap-2 flex-shrink-0">
                                    <Plus />
                                    <p className="">Adicionar um cartão</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </Draggable>
        </div>
    );
};

export default Column;
