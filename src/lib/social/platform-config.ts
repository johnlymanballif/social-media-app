import { Platform } from "@/types";

export interface PlatformConfig {
  name: string;
  characterLimit: number;
  mediaLimit: number;
  supportedMediaTypes: string[];
  maxMediaSize: number;
  color: string;
  hashtagSupport: boolean;
  mentionSupport: boolean;
  urlShortening: boolean;
  maxHashtags: number;
  maxMentions: number;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  TWITTER: {
    name: "X (Twitter)",
    characterLimit: 280,
    mediaLimit: 4,
    supportedMediaTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"],
    maxMediaSize: 5 * 1024 * 1024,
    color: "#1DA1F2",
    hashtagSupport: true,
    mentionSupport: true,
    urlShortening: true,
    maxHashtags: 3,
    maxMentions: 10,
  },
  INSTAGRAM: {
    name: "Instagram",
    characterLimit: 2200,
    mediaLimit: 10,
    supportedMediaTypes: ["image/jpeg", "image/png", "video/mp4"],
    maxMediaSize: 650 * 1024 * 1024,
    color: "#E4405F",
    hashtagSupport: true,
    mentionSupport: true,
    urlShortening: false,
    maxHashtags: 30,
    maxMentions: -1,
  },
  FACEBOOK: {
    name: "Facebook",
    characterLimit: 63206,
    mediaLimit: 10,
    supportedMediaTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"],
    maxMediaSize: 4 * 1024 * 1024 * 1024,
    color: "#1877F2",
    hashtagSupport: true,
    mentionSupport: true,
    urlShortening: false,
    maxHashtags: -1,
    maxMentions: -1,
  },
  LINKEDIN: {
    name: "LinkedIn",
    characterLimit: 3000,
    mediaLimit: 9,
    supportedMediaTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
    maxMediaSize: 5 * 1024 * 1024 * 1024,
    color: "#0A66C2",
    hashtagSupport: true,
    mentionSupport: true,
    urlShortening: false,
    maxHashtags: 3,
    maxMentions: -1,
  },
};

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return PLATFORM_CONFIG[platform];
}

export function isWithinLimits(
  platform: Platform,
  content: string,
  mediaCount: number
): { valid: boolean; errors: string[] } {
  const config = getPlatformConfig(platform);
  const errors: string[] = [];

  if (content.length > config.characterLimit) {
    errors.push(`Content exceeds ${config.name} character limit by ${content.length - config.characterLimit} characters`);
  }

  if (mediaCount > config.mediaLimit) {
    errors.push(`${config.name} supports up to ${config.mediaLimit} media items`);
  }

  return { valid: errors.length === 0, errors };
}

export function formatCharacterCount(platform: Platform, current: number, limit: number): string {
  return `${current} / ${limit}`;
}
