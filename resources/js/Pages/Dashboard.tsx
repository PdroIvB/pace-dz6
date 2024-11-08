import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Workspace } from '@/types/workspace';
import { Plus } from 'lucide-react';

type ExtendedWorkspace = Workspace & {
    tasks_count: number;
}

type DashboardProps = {
    workspaces: ExtendedWorkspace[];
    recentWorkspaces: Workspace[];
}

export default function Dashboard({ auth, workspaces, recentWorkspaces }: PageProps & DashboardProps) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="pb-12 pt-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                    {/* <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div> */}

                    {
                        recentWorkspaces && recentWorkspaces.length > 0 &&
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight p-2">Visualidados recentemente</h2>
                        </div>
                    }

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full p-4">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-4">Minhas Áreas de trabalho</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {workspaces.map((workspace) => (
                                <div
                                    onClick={() => router.get(`/workspace/${workspace.id}`)}
                                    key={workspace.id}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:scale-102 transform transition-all duration-200 cursor-pointer group">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                                            {workspace.name}
                                        </h2>
                                        <span className="text-sm text-gray-500">
                                            {workspace.tasks_count} tasks
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-100 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2">
                                <Plus className="w-8 h-8 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">Add New Workspace</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight p-2">Compartilhados comigo</h2>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
