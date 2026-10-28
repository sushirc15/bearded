import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWager(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function maskUsername(username: string): string {
  if (!username || username.length <= 3) return username || "***";
  if (username.length <= 5) {
    return `${username.slice(0, 2)}***${username.slice(-1)}`;
  }
  return `${username.slice(0, 2)}***${username.slice(-2)}`;
}
