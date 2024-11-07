import { User } from ".";

export interface Task {
    id: number;
    name: string;
    sequence: number;
    description?: string;
    assignee_id?: number;
    assignee?: User;
}