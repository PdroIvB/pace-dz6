import React, { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import {
    FormState,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
} from "react-hook-form";
import { createColumnType } from "@/Pages/Authenticated/Workspace/Index";

type ColumnCreateFormProps = {
    setCreatingColumn: React.Dispatch<React.SetStateAction<boolean>>;
    creatingColumn: boolean;
    handleSubmit: UseFormHandleSubmit<createColumnType, undefined>;
    submit: (data: createColumnType) => void;
    register: UseFormRegister<createColumnType>;
    formState: FormState<createColumnType>;
    reset: UseFormReset<createColumnType>;
};

const ColumnCreateForm = ({
    creatingColumn,
    setCreatingColumn,
    handleSubmit,
    submit,
    register,
    formState,
    reset,
}: ColumnCreateFormProps) => {
    const { errors, isValid } = formState;
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && creatingColumn) {
                setCreatingColumn(false);
                reset();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (formRef.current && !formRef.current.contains(target)) {
                setCreatingColumn(false);
                reset();
            }
        };

        if (creatingColumn) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            reset();
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [creatingColumn, setCreatingColumn]);

    if (!creatingColumn) {
        return (
            <button
                onClick={() => setCreatingColumn(true)}
                className="bg-gray-300 max-h-fit w-80 min-w-fit rounded-xl p-4 bg-opacity-40 hover:bg-gray-400 hover:bg-opacity-40 cursor-pointer"
            >
                <div className="flex gap-2 flex-shrink-0">
                    <Plus />
                    <p className="">Adicionar outra lista</p>
                </div>
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            ref={formRef}
            className="h-min w-80 flex flex-shrink-0 flex-col gap-1 transition-all duration-200 ease-in-out rounded-lg shadow-sm border border-gray-00 p-2 hover:shadow-md  cursor-pointer bg-gray-300"
        >
            <div>
                <input
                    type="text"
                    placeholder="Adicionar outra lista"
                    className={`w-full px-2 py-1 rounded-lg transition-all duration-200 bg-gray-50 hover:bg-gray-100  focus:bg-white outline-none border-1 ${
                        errors.name
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                    } placeholder-gray-400 text-gray-800`}
                    {...register("name")}
                    autoFocus
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-500 pl-1">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <div className="flex justify-between items-center">
                <button
                    type="submit"
                    className="px-2 py-1 rounded-lg transition-all duration-200 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium shadow-sm hover:shadow w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
                    disabled={!isValid}
                >
                    Adicionar lista
                </button>
                <button
                    type="button"
                    onClick={() => setCreatingColumn(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-lg  hover:bg-gray-100 transition-colors w-7 h-7 flex justify-center items-center"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};

export default ColumnCreateForm;
