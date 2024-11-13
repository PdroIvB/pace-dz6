import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ExtendedWorkspace, Workspace } from "@/types/workspace";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import WorkspaceCreateForm from "../../Components/Workspace/CreateForm";
import WorkspaceDropdown from "@/Components/Workspace/WorkspaceDropdown";
import { useAxios } from "@/hooks/useAxios";
import useToast from "@/hooks/useToast";
import WorkspaceCard from "@/Components/Workspace/WorkspaceCard";

type DashboardProps = {
    workspaces: ExtendedWorkspace[];
    recentWorkspaces: Workspace[];
    sharedWithMe: Workspace[];
};

const schema = z.object({
    name: z.string().min(3, "O nome deve ter pelos menos 3 caracteres!"),
});

export type createWorkspaceType = z.infer<typeof schema>;

export default function Dashboard({
    auth,
    workspaces,
    recentWorkspaces,
    sharedWithMe,
}: PageProps & DashboardProps) {
    const [stateWorkspaces, setStateWorkspaces] = useState<
        ExtendedWorkspace[] | []
    >(workspaces ?? []);
    const [creatingWorkspace, setCreatingWorkspace] = useState<boolean>(false);

    const { handleSubmit, register, formState, reset, setError } =
        useForm<createWorkspaceType>({
            resolver: zodResolver(schema),
        });

    const createWorkspace = (data: createWorkspaceType) => {
        router.post("/workspace", data, {
            onError: (errors) => {
                Object.keys(errors).forEach((field: string) => {
                    setError(field as keyof createWorkspaceType, {
                        type: "manual",
                        message: errors[field],
                    });
                });
            },
        });
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="pb-12 pt-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-6">
                    {recentWorkspaces && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight p-2">
                                Visualidados recentemente
                            </h2>
                        </div>
                    )}

                    <div className="bg-white  shadow-sm sm:rounded-lg w-full p-4">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-4">
                            Minhas Áreas de trabalho
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stateWorkspaces.map((workspace) => (
                                <WorkspaceCard
                                    key={workspace.id}
                                    workspace={workspace}
                                    setStateWorkspaces={setStateWorkspaces}
                                />
                            ))}
                            <WorkspaceCreateForm
                                creatingWorkspace={creatingWorkspace}
                                setCreatingWorkspace={setCreatingWorkspace}
                                handleSubmit={handleSubmit}
                                formState={formState}
                                register={register}
                                submit={createWorkspace}
                                reset={reset}
                            />
                        </div>
                    </div>

                    {sharedWithMe ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg w-full">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight p-2">
                                Compartilhados comigo
                            </h2>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}
