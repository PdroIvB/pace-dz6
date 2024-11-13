import { useAxios } from "@/hooks/useAxios";
import useToast from "@/hooks/useToast";
import { ExtendedWorkspace, Workspace } from "@/types/workspace";
import { useEffect, useRef, useState } from "react";
import WorkspaceDropdown from "./WorkspaceDropdown";
import { MoreVertical } from "lucide-react";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceType } from "@/Pages/Authenticated/Dashboard";
import { z } from "zod";
import EditForm from "./EditForm";

type WorkspaceCardProps = {
    workspace: ExtendedWorkspace;
    setStateWorkspaces: React.Dispatch<
        React.SetStateAction<[] | ExtendedWorkspace[]>
    >;
};

const schema = z.object({
    name: z.string().min(3, "O nome deve ter pelos menos 3 caracteres!"),
});

const WorkspaceCard = ({
    workspace,
    setStateWorkspaces,
}: WorkspaceCardProps) => {
    const { axiosInstance } = useAxios();
    const showToast = useToast();
    const [editingWorkspace, setEditingWorkspace] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null);
    const [openWorkspaceDropdown, setOpenWorkspaceDropdrown] =
        useState<boolean>(false);

    const { handleSubmit, register, formState, reset, setError, setValue } =
        useForm<createWorkspaceType>({
            resolver: zodResolver(schema),
        });

    const deleteWorkspace = () => {
        axiosInstance
            .delete(`/workspace/${workspace.id}`)
            .then(({ data }) => {
                setStateWorkspaces((prev) =>
                    prev.filter((item) => item.id !== workspace.id)
                );
                showToast(data.message, "success");
            })
            .catch(() =>
                showToast("Falha ao deletar área de trabalho", "error")
            );
    };

    const editWorkspace = (data: createWorkspaceType) => {
        axiosInstance
            .put(`/workspace/${workspace.id}`, data)
            .then((response) => {
                setStateWorkspaces((prev) =>
                    prev.map((item) =>
                        item.id === workspace.id
                            ? {
                                ...workspace,
                                name: response.data.workspace.name,
                            }
                            : item
                    )
                );
                setEditingWorkspace(false);
            })
            .catch((errors) => {
                Object.keys(errors).forEach((field: string) => {
                    setError(field as keyof createWorkspaceType, {
                        type: "manual",
                        message: errors[field],
                    });
                });
            });
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && editingWorkspace) {
                setEditingWorkspace(false);
                reset();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (formRef.current && !formRef.current.contains(target)) {
                setEditingWorkspace(false);
                reset();
            }
        };

        if (editingWorkspace) {
            setValue("name", workspace.name);
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            reset();
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingWorkspace, setEditingWorkspace]);

    const navigate = () => {
        if (!editingWorkspace) router.get(`/workspace/${workspace.id}`);
    };

    return (
        <button
            type="button"
            onClick={navigate}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:scale-102 transform transition-all duration-200 cursor-pointer group"
        >
            <div className="flex flex-col items-start justify-between mb-3">
                <div className="flex justify-between items-center flex-row w-full">
                    <EditForm
                        editingWorkspace={editingWorkspace}
                        formState={formState}
                        handleSubmit={handleSubmit}
                        register={register}
                        reset={reset}
                        setEditingWorkspace={setEditingWorkspace}
                        submit={editWorkspace}
                        workspace={workspace}
                        ref={formRef}
                    />
                    <button
                        className="relative p-1 hover:bg-gray-300 rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenWorkspaceDropdrown((prev) => !prev);
                        }}
                    >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                        <WorkspaceDropdown
                            openDropdown={openWorkspaceDropdown}
                            setOpenDropdown={setOpenWorkspaceDropdrown}
                            setEditingWorkspace={setEditingWorkspace}
                            deleteWorkspace={deleteWorkspace}
                        />
                    </button>
                </div>
                <span className="text-sm text-gray-500">
                    {workspace.tasks_count} tasks
                </span>
            </div>
        </button>
    );
};

export default WorkspaceCard;
