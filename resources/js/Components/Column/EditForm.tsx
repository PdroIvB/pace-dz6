import { createColumnType } from "@/Pages/Workspace/Index";
import { Column } from "@/types/column";
import { forwardRef, LegacyRef, useEffect } from "react";
import {
    FormState,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
} from "react-hook-form";

type EditFormProps = {
    editingColumn: boolean;
    setEditingColumn: React.Dispatch<React.SetStateAction<boolean>>;
    column: Column;
    handleSubmit: UseFormHandleSubmit<createColumnType, undefined>;
    submit: (data: createColumnType) => void;
    register: UseFormRegister<createColumnType>;
    formState: FormState<createColumnType>;
    reset: UseFormReset<createColumnType>;
};

const EditForm = forwardRef(function EditForm ({
    editingColumn,
    setEditingColumn,
    column,
    handleSubmit,
    formState,
    register,
    reset,
    submit,
}: EditFormProps, ref: LegacyRef<HTMLFormElement> | undefined) {

    const { errors, isValid } = formState;

    if (!editingColumn) {
        return (
            <button onClick={() => setEditingColumn(true)}
                className="w-fit px-1 py-[5px] rounded-lg hover:bg-gray-100 focus:bg-white text-start"
            >
                <h2 className="font-semibold text-gray-700">{column.name}</h2>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit(submit)} ref={ref} className="w-fit">
            <div className="w-fit">
                <input
                    type="text"
                    placeholder="Título da lista"
                    className={`w-fit text-start px-1 py-1 rounded-lg transition-all duration-200 bg-gray-50 hover:bg-gray-100  focus:bg-white ${
                        errors.name
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                    } placeholder-gray-400 text-gray-800 font-bold`}
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
