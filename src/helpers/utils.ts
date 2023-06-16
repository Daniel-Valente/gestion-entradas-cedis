import { Dock, DockItems } from "../interfaces/DockInterfaces";

export const findItemById = ( items: DockItems, itemId: string | null ): Dock | undefined => 
    items.find(({ id }: Dock) => id === itemId );

export const convertDateFormat = ( text: string | undefined, time?: boolean ) : string | number | undefined => {
    if( text ) {
        const date: Date = new Date( text );
        if( time )
            return date.toLocaleTimeString();

        return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear();
    }
}

export const generateRandomString = (num: number) : string => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";
    let ch;
    while (result.length < num){
        ch = characters.charAt(Math.floor(Math.random() * charactersLength));
        if (!result.includes(ch)){
            result += ch;
        }
    }
  return result;
}