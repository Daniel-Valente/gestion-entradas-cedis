
import { Dock, DockItems } from '../interfaces/DockInterfaces';
import docks from '../json/docks.json';

const getDockList = () => {
    let data: Dock[] = docks;

    const nodes: DockItems = data;

    return nodes;
}

export const useDockList = () => {
    return getDockList();
}