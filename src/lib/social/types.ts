export type Platform = "TWITTER" | "INSTAGRAM" | "FACEBOOK" | "LINKEDIN";

export interface SocialAccountData {
  platform: Platform;
  accountId: string;
  accountName: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  platformUrl?: string;
  error?: string;
}

export interface AnalyticsData {
  impressions: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  reach: number;
}

export interface SocialPlatformClient {
  connect(authCode: string): Promise<SocialAccountData>;
  publish(content: string, mediaUrls: string[]): Promise<PublishResult>;
  getAnalytics(platformPostId: string): Promise<AnalyticsData>;
  disconnect(): Promise<void>;
}
