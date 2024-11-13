import { Column } from "@/types/column";
import { Edit, Plus, Trash } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

type DropDownType = {
    setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    openDropdown: boolean;
    setCreatingTask: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingColumn: React.Dispatch<React.SetStateAction<boolean>>;
    deleteColumn: () => void;
};

const ColumnDropdown = ({
    setOpenDropdown,
    openDropdown,
    setCreatingTask,
    setEditingColumn,
    deleteColumn,
}: DropDownType) => {
    const dropRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && openDropdown) {
                setOpenDropdown(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropRef.current && !dropRef.current.contains(target)) {
                setOpenDropdown(false);
            }
        };

        if (openDropdown) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown, setOpenDropdown]);

    if (!openDropdown) return <></>;

    return (
        <div
            className="absolute z-50 py-1 right-0 w-40 rounded-md shadow-dropdown bg-white border border-secondary-05 ring-1 ring-black ring-opacity-5 focus:outline-none"
            ref={dropRef}
        >
            <button
                onClick={() => setEditingColumn(true)}
                className="flex items-center justify-around w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Editar título
                <Edit className="w-4 h-4 mr-3" />
            </button>
            <hr className="my-2 border-gray-200" />
            <button
                onClick={deleteColumn}
                className="flex items-center justify-around w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Deletar lista
                <Trash className="w-4 h-4 mr-3" />
            </button>
            <hr className="my-2 border-gray-200" />
            <button
                onClick={() => setCreatingTask(true)}
                className="flex items-center justify-around w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
            >
                Criar cartão
                <Plus className="w-4 h-4 mr-2" />
            </button>
        </div>
    );
};

export default ColumnDropdown;
