import { findItemById } from "../helpers/utils";
import { Dock, DockItems, StateSetter } from "../interfaces/DockInterfaces";

export const openDeleteModal = (
    event: string,
    items: DockItems,
    setInteractionItem: StateSetter<Dock | null>, 
    setDeleteModal: StateSetter<boolean>,
) => {
    const interactionItem = findItemById( items, event );
    if( interactionItem ) {
        setInteractionItem( interactionItem )
        setDeleteModal(true);
    }
}

export const confirmDeleteItem = (
    interactionItem: Dock | null,
    setItems: StateSetter<DockItems>
) => {
    if( interactionItem ) {
        setItems(items => items.filter((i, _, arr) => i.id !== interactionItem.id )); 
    }
}