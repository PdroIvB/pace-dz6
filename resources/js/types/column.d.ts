import { User } from ".";
import { Task } from "./task";

export interface Column {
    id: number;
    name: string;
    sequence: number;
    tasks?: Task[];
}