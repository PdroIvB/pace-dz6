import {
    FormState,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
} from "react-hook-form";
import { createTaskType } from "../Workspace/Column";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type TaskCreateFormProps = {
    setCreatingTask: React.Dispatch<React.SetStateAction<boolean>>;
    creatingTask: boolean;
    handleSubmit: UseFormHandleSubmit<createTaskType, undefined>;
    submit: (data: createTaskType) => void;
    register: UseFormRegister<createTaskType>;
    formState: FormState<createTaskType>;
    reset: UseFormReset<createTaskType>;
};

const TaskCreateForm = ({
    creatingTask,
    setCreatingTask,
    handleSubmit,
    submit,
    register,
    formState,
    reset,
}: TaskCreateFormProps) => {
    const { errors, isValid } = formState;
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && creatingTask) {
                setCreatingTask(false);
                reset();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (formRef.current && !formRef.current.contains(target)) {
                setCreatingTask(false);
                reset();
            }
        };

        if (creatingTask) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            reset();
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [creatingTask, setCreatingTask]);

    if (!creatingTask) {
        return <></>;
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(submit)}
                ref={formRef}
                className="flex flex-col gap-1 mt-4 mr-1 transition-all duration-200 ease-in-out rounded-lg shadow-sm border border-gray-00 p-2 hover:shadow-md  cursor-pointer bg-white"
            >
                <div>
                    <input
                        type="text"
                        placeholder="Insira um título"
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
                        Adicionar cartão
                    </button>
                    <button
                        type="button"
                        onClick={() => setCreatingTask(false)}
                        className="text-gray-400 hover:text-gray-600 rounded-lg  hover:bg-gray-100 transition-colors w-7 h-7 flex justify-center items-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </>
    );
};

export default TaskCreateForm;
