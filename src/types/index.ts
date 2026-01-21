export type Platform = "TWITTER" | "INSTAGRAM" | "FACEBOOK" | "LINKEDIN";

export interface PlatformContent {
  id: string;
  postId: string;
  platform: Platform;
  content: string;
  mediaUrls: string;
  excluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithPlatformContent {
  id: string;
  content: string;
  mediaUrls: string[];
  status: string;
  workspaceId: string;
  campaignId: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  platformContents?: PlatformContent[];
}

export interface CreatePlatformContentData {
  postId: string;
  platform: Platform;
  content?: string;
  mediaUrls?: string[];
  excluded?: boolean;
}

export interface UpdatePlatformContentData {
  content?: string;
  mediaUrls?: string[];
  excluded?: boolean;
}

export interface PlatformValidationResult {
  isValid: boolean;
  characterCount: number;
  characterLimit: number;
  mediaCount: number;
  mediaLimit: number;
  errors: string[];
}

export function getPlatformLimit(platform: Platform): { characters: number; images: number; video: number } {
  const limits: Record<Platform, { characters: number; images: number; video: number }> = {
    TWITTER: { characters: 280, images: 4, video: 1 },
    INSTAGRAM: { characters: 2200, images: 10, video: 1 },
    FACEBOOK: { characters: 63206, images: 10, video: 1 },
    LINKEDIN: { characters: 3000, images: 9, video: 1 },
  };
  return limits[platform];
}

export function validatePlatformContent(
  platform: Platform,
  content: string,
  mediaUrls: string[]
): PlatformValidationResult {
  const limit = getPlatformLimit(platform);
  const mediaCount = mediaUrls.length;
  const errors: string[] = [];

  if (content.length > limit.characters) {
    errors.push(`Content exceeds ${platform} character limit by ${content.length - limit.characters} characters`);
  }

  if (mediaCount > limit.images) {
    errors.push(`${platform} supports up to ${limit.images} images. Extra media will not be included.`);
  }

  return {
    isValid: errors.length === 0,
    characterCount: content.length,
    characterLimit: limit.characters,
    mediaCount,
    mediaLimit: limit.images,
    errors,
  };
}

export function mergePostWithPlatformContent(
  post: { content: string; mediaUrls: string | string[] },
  platformContents: PlatformContent[],
  platform: Platform
): { content: string; mediaUrls: string[] } {
  const platformContent = platformContents.find((pc) => pc.platform === platform);

  const parseMediaUrls = (urls: string | string[]): string[] => {
    if (Array.isArray(urls)) return urls;
    try {
      return JSON.parse(urls || "[]");
    } catch {
      return [];
    }
  };

  if (!platformContent) {
    return {
      content: post.content,
      mediaUrls: parseMediaUrls(post.mediaUrls),
    };
  }

  return {
    content: platformContent.content || post.content,
    mediaUrls: platformContent.mediaUrls ? parseMediaUrls(platformContent.mediaUrls) : parseMediaUrls(post.mediaUrls as string),
  };
}
