import { Dispatch, SetStateAction } from "react";

export type DockItems = Dock[];
export type DataIndex = keyof Dock;
export type StateSetter<T> = Dispatch<SetStateAction<T>>;
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Dock {
    id: string;
    name: string;
    hasCrossDocking: boolean;
    lastSchedulingDate: string;
}