import Column from "@/Components/Workspace/Column";
import { Column as ColumnType } from "@/types/column";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import {
    DragDropContext,
    DraggableLocation,
    Droppable,
    DropResult,
} from "react-beautiful-dnd";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useAxios } from "@/hooks/useAxios";
import useToast from "@/hooks/useToast";
import ColumnCreateForm from "@/Components/Column/CreateForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const reorder = (
    list: Array<ColumnType | Task> | undefined,
    startIndex: number,
    endIndex: number
) => {
    if (!list) return;
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// Helper function to move an item between two arrays
const move = (
    source: Array<Task>,
    destination: Array<Task>,
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
) => {
    if (!source || !destination) return;

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    return {
        sourceItems: sourceClone as Task[],
        destinationItems: destClone as Task[],
    };
};

const schema = z.object({
    name: z.string().min(3, "O nome deve ter pelos menos 3 caracteres!"),
});

export type createColumnType = z.infer<typeof schema>;

export default function Index({
    workspace,
    auth,
}: PageProps & {
    workspace: Workspace;
}) {
    const { axiosInstance } = useAxios();
    const showToast = useToast();
    const [creatingColumn, setCreatingColumn] = useState<boolean>(false);

    const [columns, setColumns] = useState<ColumnType[] | []>(
        workspace.columns || []
    );

    const onDragEnd = (result: DropResult) => {
        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;
        const [draggableType, draggableId] =
            result.draggableId.split(/-(?=\d+)/);

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // reordering column
        if (result.type === "COLUMN") {
            const column = columns.find(
                (column: ColumnType) => column.id === parseInt(draggableId, 10)
            );
            if (!column) return;

            const orderedColumns = reorder(
                columns,
                source.index,
                destination.index
            );

            setColumns(orderedColumns as ColumnType[]);

            axiosInstance
                .put(`/workspace/${workspace.id}/column/${column.id}`, {
                    newSequence: destination.index + 1,
                })
                .then((response) => {})
                .catch((error) => {
                    console.error(error);
                    showToast("Erro ao reordenar colunas!", "error");
                });

            return;
        }

        if (result.type === "TASK") {
            //ordering within the same column
            if (source.droppableId === destination.droppableId) {
                const colId = parseInt(
                    destination.droppableId.split(/-(?=\d+)/)[1],
                    10
                );

                const column = columns.find((col) => col.id === colId);
                if (!column) return;

                const tasks = reorder(
                    column!.tasks ?? [],
                    source.index,
                    destination.index
                );

                column.tasks = tasks;

                setColumns((prevState) =>
                    prevState.map((col) =>
                        col.id === column.id ? column : col
                    )
                );

                axiosInstance
                    .put(
                        `/workspace/${workspace.id}/column/${column.id}/task/${draggableId}`,
                        {
                            newSequence: destination.index + 1,
                        }
                    )
                    .then((response) => {})
                    .catch((error) => {
                        console.error(error);
                        showToast("Erro ao reordenar tarefas!", "error");
                    });

                return;
            } else {
                const sourceColumnId = parseInt(
                    source.droppableId.split(/-(?=\d+)/)[1],
                    10
                );
                const destinationColumnId = parseInt(
                    destination.droppableId.split(/-(?=\d+)/)[1],
                    10
                );

                const sourceColumn = columns.find(
                    (col) => col.id === sourceColumnId
                );
                const destinationColumn = columns.find(
                    (col) => col.id === destinationColumnId
                );
                if (!sourceColumn || !destinationColumn) return;

                const result = move(
                    sourceColumn.tasks ?? [],
                    destinationColumn.tasks ?? [],
                    source,
                    destination
                );

                if (!result) return;

                const { sourceItems, destinationItems } = result;
                sourceColumn.tasks = sourceItems;
                destinationColumn.tasks = destinationItems;

                setColumns((prevState) =>
                    prevState.map((col) =>
                        col.id === sourceColumn.id
                            ? sourceColumn
                            : col.id === destinationColumn.id
                            ? destinationColumn
                            : col
                    )
                );

                axiosInstance
                    .put(
                        `/workspace/${workspace.id}/column/${sourceColumnId}/task/${draggableId}/move`,
                        {
                            newSequence: destination.index + 1,
                            destinationColumnId: destinationColumnId,
                        }
                    )
                    .then((response) => {})
                    .catch((error) => {
                        console.error(error);
                        showToast("Erro ao mover tarefa!", "error");
                    });

                return;
            }
        }

        return;
    };

    const { handleSubmit, register, formState, reset, setError } =
        useForm<createColumnType>({
            resolver: zodResolver(schema),
        });

    const createColumn = (data: createColumnType) => {
        console.log(data);
        axiosInstance
            .post("/column", { ...data, workspace_id: workspace.id })
            .then(({ data }) => {
                setColumns((prev) => [...prev, data.column]);
                setCreatingColumn(false);
            })
            .catch((errors) => {
                Object.keys(errors).forEach((field: string) => {
                    setError(field as keyof createColumnType, {
                        type: "manual",
                        message: errors[field],
                    });
                });
            });
    };

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title={workspace.name} />
                <div className="max-h-full">
                    <div className="py-4 pl-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {workspace.name}
                        </h1>
                    </div>
                    <div className="">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId="board"
                                type="COLUMN"
                                direction="horizontal"
                            >
                                {(provided, snapshot) => (
                                    <div
                                        className={`${
                                            snapshot.isDraggingOver
                                                ? "bg-green-200"
                                                : ""
                                        }`}
                                    >
                                        <div className="w-full mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 h-[calc(100svh-125px)] "
                                            >
                                                {columns.map(
                                                    (
                                                        column: ColumnType,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <Column
                                                                key={column.id}
                                                                column={column}
                                                                index={index}
                                                                setColumns={setColumns}
                                                            />
                                                        );
                                                    }
                                                )}
                                                {provided.placeholder}
                                                <ColumnCreateForm
                                                    creatingColumn={creatingColumn}
                                                    setCreatingColumn={setCreatingColumn}
                                                    handleSubmit={handleSubmit}
                                                    register={register}
                                                    formState={formState}
                                                    reset={reset}
                                                    submit={createColumn}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
