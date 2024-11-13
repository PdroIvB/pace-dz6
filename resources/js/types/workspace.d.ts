import { User } from ".";
import { Column } from "./column";

export interface Workspace {
    id: number;
    name: string;
    owner_id: number;
    owner?: User;
    columns: Column[] | null;
    participants?: User[];
}

export type ExtendedWorkspace = Workspace & {
    tasks_count: number;
};