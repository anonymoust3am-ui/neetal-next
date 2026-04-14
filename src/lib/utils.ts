import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 10_000_00) return `${(n / 10_000_00).toFixed(1)}Cr`;
  if (n >= 1_00_000)  return `${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRank(rank: number): string {
  return new Intl.NumberFormat("en-IN").format(rank);
}

export type BucketType = "safe" | "target" | "dream";

export function getRankBucket(rank: number, closingRank: number): BucketType {
  const ratio = rank / closingRank;
  if (ratio <= 0.7)  return "safe";
  if (ratio <= 0.95) return "target";
  return "dream";
}
