import { Dock, DockItems } from "../interfaces/DockInterfaces";

export const findItemById = ( items: DockItems, itemId: string | null ): Dock | undefined => 
    items.find(({ id }: Dock) => id === itemId );

export const convertDateFormat = ( text: string | undefined ) => {
    if( text ) {
        const date: Date = new Date( text );

        return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear();
    }
}

export const  generateRandomString = (num: number) => {
    let result1= Math.random().toString(36).substring(0,num);       
    return result1;
}