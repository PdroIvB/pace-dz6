import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MoreVertical, Plus } from "lucide-react";
import { Column } from "@/types/column";
import { Head } from "@inertiajs/react";
import { Workspace } from "@/types/workspace";
import { useState } from "react";

// Priority badge colors
const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
};

export default function Index ({auth, workspace}: PageProps & {workspace: Workspace}) {

    const [columns, setColumns] = useState<Column[] | null>(workspace.columns);

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title={workspace.name} />
            <div className="flex gap-6 overflow-x-auto pb-4">
                {columns && columns.map((column) => (
                    <div
                        key={column.id}
                        className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
                    >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-gray-700">{column.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{column.tasks?.length ?? 0}</span>
                            <button className="p-1 hover:bg-gray-200 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        </div>

                        {/* Task Cards */}
                        <div className="flex flex-col gap-3">
                        {column.tasks && column.tasks.map((task) => (
                            <div
                            key={task.id}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 
                                    hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            >
                            <h3 className="font-medium text-gray-800 mb-2">{task.name}</h3>
                            {/* <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
                                {task.priority}
                                </span>
                                <span className="text-sm text-gray-500">Due {task.dueDate}</span>
                            </div> */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-xs text-gray-600">{task.assignee?.name[0] ?? ""}</span>
                                </div>
                                <span className="text-sm text-gray-600 ml-2">{task.assignee?.name}</span>
                                </div>
                            </div>
                            </div>
                        ))}

                        {/* Add Task Button */}
                        <button className="flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-200 
                                        rounded transition-colors duration-200 w-full">
                            <Plus className="w-4 h-4" />
                            <span className="text-sm">Add Task</span>
                        </button>
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}