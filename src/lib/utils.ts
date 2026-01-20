import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export const PLATFORM_LIMITS = {
  TWITTER: { characters: 280, images: 4, video: 1 },
  INSTAGRAM: { characters: 2200, images: 10, video: 1 },
  FACEBOOK: { characters: 63206, images: 10, video: 1 },
  LINKEDIN: { characters: 3000, images: 9, video: 1 },
} as const;

export const PLATFORM_COLORS = {
  TWITTER: "#1DA1F2",
  INSTAGRAM: "#E4405F",
  FACEBOOK: "#1877F2",
  LINKEDIN: "#0A66C2",
} as const;

export const PLATFORM_NAMES = {
  TWITTER: "Twitter/X",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  LINKEDIN: "LinkedIn",
} as const;
