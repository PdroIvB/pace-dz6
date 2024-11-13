import React, { useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
    FormState,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
} from "react-hook-form";
import { createWorkspaceType } from "../../Pages/Authenticated/Dashboard";

type WorkspaceCreateFormProps = {
    setCreatingWorkspace: React.Dispatch<React.SetStateAction<boolean>>;
    creatingWorkspace: boolean;
    handleSubmit: UseFormHandleSubmit<createWorkspaceType, undefined>;
    submit: (data: createWorkspaceType) => void;
    register: UseFormRegister<createWorkspaceType>;
    formState: FormState<createWorkspaceType>;
    reset: UseFormReset<createWorkspaceType>;
};

const WorkspaceCreateForm = ({
    creatingWorkspace,
    setCreatingWorkspace,
    handleSubmit,
    submit,
    register,
    formState,
    reset,
}: WorkspaceCreateFormProps) => {
    const { errors, isValid } = formState;

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && creatingWorkspace) {
                setCreatingWorkspace(false);
                reset();
            }
        };

        if (creatingWorkspace) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            reset();
            document.removeEventListener("keydown", handleEscape);
        };
    }, [creatingWorkspace, setCreatingWorkspace]);

    if (!creatingWorkspace) {
        return (
            <button
                onClick={() => setCreatingWorkspace(true)}
                className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-100 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2"
            >
                <Plus className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">
                    Add New Workspace
                </span>
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="relative p-8 rounded-xl border-2 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md bg-white max-w-md w-full flex flex-col items-center justify-center gap-4 border-gray-200 hover:border-gray-300"
        >
            <button
                type="button"
                onClick={() => setCreatingWorkspace(false)}
                className="absolute right-2 top-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="w-full">
                <input
                    type="text"
                    placeholder="Nome da área de trabalho"
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white outline-none border-2 ${
                        errors.name
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                    } placeholder-gray-400 text-gray-800`}
                    {...register("name")}
                    autoFocus
                />
                {errors.name && (
                    <p className="mt-2 text-sm text-red-500 pl-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="px-6 py-3 rounded-lg transition-all duration-200 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium shadow-sm hover:shadow w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={!isValid}
            >
                Criar workspace
            </button>
        </form>
    );
};

export default WorkspaceCreateForm;
