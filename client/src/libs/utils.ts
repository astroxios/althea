import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// "cn" stands for className
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}