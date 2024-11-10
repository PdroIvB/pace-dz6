import Column1 from "@/Components/Workspace/Column1";
import { Column as ColumnType } from "@/types/column";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import axios from "axios";
import { useAxios } from "@/hooks/useAxios";
import useToast from "@/hooks/useToast";

// const reorder = (list: any, startIndex: number, endIndex: number) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);

//     return result;
// };

// export const reorderTaskMap = ({
//     taskMap,
//     source,
//     destination,
// }: {
//     taskMap: any;
//     source: any;
//     destination: any;
// }) => {
//     // const current = [...taskMap[source.droppableId]];
//     const current = taskMap.findIndex(source.droppableId);
//     const next = [...taskMap[destination.droppableId]];
//     const target = current[source.index];

//     // moving to same list
//     if (source.droppableId === destination.droppableId) {
//         const reordered = reorder(current, source.index, destination.index);
//         const result = {
//             ...taskMap,
//             [source.droppableId]: reordered,
//         };
//         return {
//             taskMap: result,
//         };
//     }

//     // moving to different list

//     // remove from original
//     current.splice(source.index, 1);
//     // insert into next
//     next.splice(destination.index, 0, target);

//     const result = {
//         ...taskMap,
//         [source.droppableId]: current,
//         [destination.droppableId]: next,
//     };

//     return {
//         quoteMap: result,
//     };
// };

export default function Index({
    workspace,
    containerHeight,
    isCombineEnabled = false,
    useClone,
    auth,
}: PageProps & {
    workspace: Workspace;
    containerHeight: any;
    isCombineEnabled: boolean;
    withScrollableColumns: any;
    useClone: any;
}) {
    const { axiosInstance } = useAxios();
    const showToast = useToast();

    // const [columns, setColumns] = useState<ColumnType[] | []>(
    const [columns, setColumns] = useState<any>(
        workspace.columns ?? []
    );

    // const [ordered, setOrdered] = useState<any>(
    //     Object.keys(workspace.columns ?? {})
    // );

    const onDragEnd = (result: any) => {
        // console.log(result);

        // dropped nowhere
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // reordering column
        if (result.type === "COLUMN") {

            const column = columns.find((column: any) => column.sequence === source.index);

            const newSequence = destination.index;

            setColumns((prevColumns: any) => {
                const updatedColumns = [...prevColumns];
                const movedColumn = updatedColumns.find(col => col.id === column.id);
                const oldSequence = movedColumn.sequence;
        
                // Update sequences for all affected columns
                updatedColumns.forEach(col => {
                if (newSequence < oldSequence) {
                    // Moving forward (e.g., 3 → 1)
                    if (col.sequence >= newSequence && col.sequence < oldSequence) {
                    col.sequence += 1;
                    }
                } else {
                    // Moving backward (e.g., 1 → 3)
                    if (col.sequence > oldSequence && col.sequence <= newSequence) {
                    col.sequence -= 1;
                    }
                }
                });
        
                // Update the moved column's sequence
                movedColumn.sequence = newSequence;
        
                // Sort columns by sequence
                return updatedColumns.sort((a, b) => a.sequence - b.sequence);
            });

            axiosInstance.put(`/workspace/${workspace.id}/${column.id}`, {newSequence: newSequence})
                .then((response) => {})
                .catch((error) => {
                    console.error(error);
                    showToast('Erro ao reordenar colunas!', 'error');
                });

            return;
        }

        // const data = reorderTaskMap({
        //     taskMap: columns,
        //     source,
        //     destination,
        // });

        // setColumns(data.quoteMap);
        // console.log("SUCCESS?");
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
                        ignoreContainerClipping={Boolean(containerHeight)}
                        isCombineEnabled={isCombineEnabled}
                    >
                        {(provided) => (
                            <div className="pb-12 pt-4">
                                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex gap-6 overflow-x-auto pb-4"
                                    >
                                        {/* {ordered.map((key, index) => { */}
                                        {columns.map((column:any, index:any) => {
                                            return (
                                                <Column1
                                                    column={column}
                                                    index={column.sequence}
                                                    key={column.id}
                                                    name={column.name}
                                                    id={`${column.id}`}
                                                    tasks={column.tasks}
                                                    isScrollable={true}
                                                    isCombineEnabled={
                                                        isCombineEnabled
                                                    }
                                                    useClone={useClone}
                                                />
                                            );
                                        })}
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
