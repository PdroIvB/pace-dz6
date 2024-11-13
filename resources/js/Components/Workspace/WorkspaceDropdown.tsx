import { Workspace } from "@/types/workspace";
import { Edit, Trash } from "lucide-react";
import { useEffect, useRef } from "react";

type DropDownType = {
    setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    openDropdown: boolean;
    setEditingWorkspace: React.Dispatch<React.SetStateAction<boolean>>;
    deleteWorkspace: () => void;
};

const WorkspaceDropdown = ({
    setOpenDropdown,
    openDropdown,
    setEditingWorkspace,
    deleteWorkspace,
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
            className="absolute z-500 py-1 right-0 w-40 rounded-md shadow-dropdown bg-white border border-secondary-05 ring-1 ring-black ring-opacity-5 focus:outline-none"
            ref={dropRef}
        >
            <button
                onClick={() => setEditingWorkspace(true)}
                className="flex items-center justify-around gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Editar título
                <Edit className="w-4 h-4 mr-3" />
            </button>
            <hr className="my-2 border-gray-200" />
            <button
                onClick={deleteWorkspace}
                className="flex items-center justify-around gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Deletar área de trabalho
                <Trash className="w-4 h-4 mr-3" />
            </button>
        </div>
    );
};

export default WorkspaceDropdown;
