import {
  Platform,
  SocialAccountData,
  PublishResult,
  AnalyticsData,
  SocialPlatformClient,
} from "./types";

// Mock client that simulates social platform APIs
export class MockSocialClient implements SocialPlatformClient {
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  async connect(authCode: string): Promise<SocialAccountData> {
    // Simulate OAuth flow
    await this.delay(500);

    const mockAccounts: Record<Platform, { id: string; name: string }> = {
      TWITTER: { id: "tw_123456", name: "@socialhub_demo" },
      INSTAGRAM: { id: "ig_789012", name: "socialhub_demo" },
      FACEBOOK: { id: "fb_345678", name: "SocialHub Demo Page" },
      LINKEDIN: { id: "li_901234", name: "SocialHub Demo Company" },
    };

    const account = mockAccounts[this.platform];

    return {
      platform: this.platform,
      accountId: account.id,
      accountName: account.name,
      accessToken: `mock_access_${authCode}_${Date.now()}`,
      refreshToken: `mock_refresh_${authCode}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }

  async publish(content: string, mediaUrls: string[]): Promise<PublishResult> {
    // Simulate posting
    await this.delay(1000);

    // 95% success rate simulation
    if (Math.random() > 0.95) {
      return {
        success: false,
        error: "Mock API rate limit exceeded. Please try again later.",
      };
    }

    const postId = `${this.platform.toLowerCase()}_post_${Date.now()}`;
    const urls: Record<Platform, string> = {
      TWITTER: `https://twitter.com/i/status/${postId}`,
      INSTAGRAM: `https://instagram.com/p/${postId}`,
      FACEBOOK: `https://facebook.com/posts/${postId}`,
      LINKEDIN: `https://linkedin.com/posts/${postId}`,
    };

    return {
      success: true,
      platformPostId: postId,
      platformUrl: urls[this.platform],
    };
  }

  async getAnalytics(platformPostId: string): Promise<AnalyticsData> {
    // Simulate fetching analytics with realistic-looking random data
    await this.delay(300);

    const baseEngagement = Math.floor(Math.random() * 1000) + 100;

    return {
      impressions: baseEngagement * 10 + Math.floor(Math.random() * 5000),
      engagements: baseEngagement,
      likes: Math.floor(baseEngagement * 0.6),
      comments: Math.floor(baseEngagement * 0.1),
      shares: Math.floor(baseEngagement * 0.05),
      clicks: Math.floor(baseEngagement * 0.15),
      reach: baseEngagement * 8 + Math.floor(Math.random() * 3000),
    };
  }

  async disconnect(): Promise<void> {
    await this.delay(200);
    // In real implementation, would revoke tokens
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function createSocialClient(platform: Platform): SocialPlatformClient {
  // In production, would return real clients based on platform
  // For now, always return mock client
  return new MockSocialClient(platform);
}
