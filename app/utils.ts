import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formaSize(bytes:number):string{
if ( bytes === 0) return ' 0 Bytes';
const k = 1024;
const Sizes=['Bytes','KB','MB','GB','TB'];
const i = Math.floor(Math.log( bytes ) / Math.log( k ));
return parseFloat((bytes / Math.pow(k,i)).toFixed(2)) + ' ' + Sizes[i];
 
}
export const generateUUID = ()=>crypto.randomUUID();