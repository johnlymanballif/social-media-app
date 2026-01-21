import { z } from "zod";
import { Platform } from "@/types";
import { getPlatformConfig } from "@/lib/social/platform-config";

export const platformContentSchema = z.object({
  platform: z.enum(["TWITTER", "INSTAGRAM", "FACEBOOK", "LINKEDIN"]),
  content: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  excluded: z.boolean().optional(),
});

export const createPlatformContentSchema = z.object({
  postId: z.string(),
  platform: z.enum(["TWITTER", "INSTAGRAM", "FACEBOOK", "LINKEDIN"]),
  content: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  excluded: z.boolean().optional(),
});

export const updatePlatformContentSchema = z.object({
  content: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  excluded: z.boolean().optional(),
});

export const platformContentsBatchSchema = z.object({
  contents: z.array(
    z.object({
      platform: z.enum(["TWITTER", "INSTAGRAM", "FACEBOOK", "LINKEDIN"]),
      content: z.string().optional(),
      mediaUrls: z.array(z.string()).optional(),
      excluded: z.boolean().optional(),
    })
  ),
});

export function validatePlatformContent(
  platform: Platform,
  content: string,
  mediaUrls: string[]
): { valid: boolean; errors: string[] } {
  const config = getPlatformConfig(platform);
  const errors: string[] = [];

  if (content.length > config.characterLimit) {
    errors.push(`Content exceeds ${config.name} character limit by ${content.length - config.characterLimit} characters`);
  }

  if (mediaUrls.length > config.mediaLimit) {
    errors.push(`${config.name} supports up to ${config.mediaLimit} media items`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateAllPlatformContents(
  contents: Array<{ platform: Platform; content: string; mediaUrls: string[] }>
): { valid: boolean; errors: Record<Platform, string[]> } {
  const errors: Record<Platform, string[]> = {
    TWITTER: [],
    INSTAGRAM: [],
    FACEBOOK: [],
    LINKEDIN: [],
  };

  for (const item of contents) {
    const validation = validatePlatformContent(item.platform, item.content, item.mediaUrls);
    if (!validation.valid) {
      errors[item.platform] = validation.errors;
    }
  }

  return { valid: Object.values(errors).every((e) => e.length === 0), errors };
}
