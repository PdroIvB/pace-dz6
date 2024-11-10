import Column1 from "@/Components/Workspace/Column1";
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

export default function Index({
    workspace,
    auth,
}: PageProps & {
    workspace: Workspace;
}) {
    const { axiosInstance } = useAxios();
    const showToast = useToast();

    const [columns, setColumns] = useState<ColumnType[] | []>(
        workspace.columns ?? []
    );

    const onDragEnd = (result: DropResult) => {
        // console.log(result);

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

            const newSequence = destination.index;

            setColumns((prevColumns: ColumnType[]) => {
                const updatedColumns = [...prevColumns];
                const movedColumn = updatedColumns.find(
                    (col) => col.id === column!.id
                );
                const oldSequence = movedColumn!.sequence;

                // Update sequences for all affected columns
                updatedColumns.forEach((col) => {
                    if (newSequence < oldSequence) {
                        // Moving forward (e.g., 3 → 1)
                        if (
                            col.sequence >= newSequence &&
                            col.sequence < oldSequence
                        ) {
                            col.sequence += 1;
                        }
                    } else {
                        // Moving backward (e.g., 1 → 3)
                        if (
                            col.sequence > oldSequence &&
                            col.sequence <= newSequence
                        ) {
                            col.sequence -= 1;
                        }
                    }
                });

                // Update the moved column's sequence
                movedColumn!.sequence = newSequence;

                // Sort columns by sequence
                return updatedColumns.sort((a, b) => a.sequence - b.sequence);
            });

            axiosInstance
                .put(`/workspace/${workspace.id}/${column.id}`, {
                    newSequence: newSequence+1,
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
                        col.id === sourceColumn.id ? sourceColumn : col.id === destinationColumn.id ? destinationColumn : col
                    )
                );
                return;

            }
        }

        return;
    };

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <Head title={workspace.name} />
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId="board"
                        type="COLUMN"
                        direction="horizontal"
                    >
                        {(provided) => (
                            <div className="pb-12 pt-4">
                                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex gap-6 overflow-x-auto pb-4"
                                    >
                                        {columns.map(
                                            (
                                                column: ColumnType,
                                                index: number
                                            ) => {
                                                return (
                                                    <Column1
                                                        key={column.id}
                                                        column={column}
                                                        index={index}
                                                    />
                                                );
                                            }
                                        )}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </AuthenticatedLayout>
        </>
    );
}
