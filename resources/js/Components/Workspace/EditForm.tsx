import { createWorkspaceType } from "@/Pages/Authenticated/Dashboard";
import { Workspace } from "@/types/workspace";
import { forwardRef, LegacyRef, useEffect } from "react";
import {
    FormState,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
} from "react-hook-form";

type EditFormProps = {
    editingWorkspace: boolean;
    setEditingWorkspace: React.Dispatch<React.SetStateAction<boolean>>;
    workspace: Workspace;
    handleSubmit: UseFormHandleSubmit<createWorkspaceType, undefined>;
    submit: (data: createWorkspaceType) => void;
    register: UseFormRegister<createWorkspaceType>;
    formState: FormState<createWorkspaceType>;
    reset: UseFormReset<createWorkspaceType>;
};

const EditForm = forwardRef(function EditForm(
    {
        editingWorkspace,
        setEditingWorkspace,
        workspace,
        handleSubmit,
        formState,
        register,
        reset,
        submit,
    }: EditFormProps,
    ref: LegacyRef<HTMLFormElement> | undefined
) {
    const { errors, isValid } = formState;

    if (!editingWorkspace) {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setEditingWorkspace(true);
                }}
                className="w-fit px-[5px] py-[5px] rounded-lg focus:bg-white text-start"
            >
                <h2 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                    {workspace.name}
                </h2>
            </button>
        );
    }

    return (
        <form
            onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(submit)(e);
            }}
            ref={ref}
            className="w-full"
        >
            <div className="">
                <input
                    type="text"
                    className={`w-full text-start px-1 py-1 rounded-lg bg-gray-50 hover:bg-gray-100  focus:bg-white ${
                        errors.name
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                    } text-gray-800 text-lg font-bold`}
                    {...register("name")}
                    autoFocus
                />
                {errors.name && (
                    <p className=" text-sm text-red-500 pl-1">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <button type="submit" className="hidden"></button>
        </form>
    );
});

export default EditForm;
