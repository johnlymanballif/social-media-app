"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Clock,
  Calendar,
  Play,
  Pause,
  MoreVertical,
  CheckCircle,
  XCircle,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import { formatDateTime, truncate } from "@/lib/utils";

const PLATFORM_ICONS: Record<string, any> = {
  TWITTER: Twitter,
  LINKEDIN: Linkedin,
  FACEBOOK: Facebook,
  INSTAGRAM: Instagram,
};

interface ScheduledPost {
  id: string;
  scheduledFor: string;
  status: "PENDING" | "PUBLISHING" | "PUBLISHED" | "FAILED";
  post: {
    id: string;
    content: string;
    campaign: { name: string; color: string } | null;
  };
  socialAccount: {
    platform: string;
    accountName: string;
  };
  publishedAt?: string;
  platformUrl?: string;
}

const MOCK_SCHEDULED: ScheduledPost[] = [
  {
    id: "1",
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    post: {
      id: "1",
      content: "Exciting news coming soon! Stay tuned for our biggest announcement yet.",
      campaign: { name: "Product Launch", color: "#3B82F6" },
    },
    socialAccount: { platform: "TWITTER", accountName: "@company" },
  },
  {
    id: "2",
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    post: {
      id: "1",
      content: "Exciting news coming soon! Stay tuned for our biggest announcement yet.",
      campaign: { name: "Product Launch", color: "#3B82F6" },
    },
    socialAccount: { platform: "LINKEDIN", accountName: "Company Page" },
  },
  {
    id: "3",
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    post: {
      id: "2",
      content: "Early bird discounts are here! Don't miss out on our holiday deals.",
      campaign: { name: "Holiday Sale", color: "#10B981" },
    },
    socialAccount: { platform: "FACEBOOK", accountName: "Company Page" },
  },
  {
    id: "4",
    scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "PUBLISHED",
    post: {
      id: "3",
      content: "Thank you to our amazing customers for 10K followers!",
      campaign: null,
    },
    socialAccount: { platform: "INSTAGRAM", accountName: "@company" },
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    platformUrl: "https://instagram.com/p/123",
  },
  {
    id: "5",
    scheduledFor: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: "FAILED",
    post: {
      id: "4",
      content: "Check out our latest blog post on productivity tips!",
      campaign: null,
    },
    socialAccount: { platform: "TWITTER", accountName: "@company" },
  },
];

const STATUS_STYLES: Record<string, { color: string; icon: any }> = {
  PENDING: { color: "bg-blue-100 text-blue-800", icon: Clock },
  PUBLISHING: { color: "bg-yellow-100 text-yellow-800", icon: Play },
  PUBLISHED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  FAILED: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>(MOCK_SCHEDULED);
  const [tab, setTab] = useState("upcoming");

  const upcomingPosts = posts.filter(
    (p) => p.status === "PENDING" || p.status === "PUBLISHING"
  );
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");
  const failedPosts = posts.filter((p) => p.status === "FAILED");

  function handlePublishNow(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "PUBLISHED",
              publishedAt: new Date().toISOString(),
              platformUrl: `https://example.com/post/${id}`,
            }
          : p
      )
    );
  }

  function handleRetry(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "PENDING", scheduledFor: new Date().toISOString() }
          : p
      )
    );
  }

  function handleCancel(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const renderPost = (post: ScheduledPost) => {
    const PlatformIcon = PLATFORM_ICONS[post.socialAccount.platform];
    const StatusInfo = STATUS_STYLES[post.status];
    const StatusIcon = StatusInfo.icon;

    return (
      <div
        key={post.id}
        className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <PlatformIcon className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">
              {post.socialAccount.accountName}
            </span>
            <Badge className={StatusInfo.color} variant="secondary">
              <StatusIcon className="h-3 w-3 mr-1" />
              {post.status}
            </Badge>
            {post.post.campaign && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${post.post.campaign.color}20`,
                  color: post.post.campaign.color,
                }}
              >
                {post.post.campaign.name}
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-2">
            {truncate(post.post.content, 150)}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.status === "PUBLISHED" && post.publishedAt
                ? `Published ${formatDateTime(post.publishedAt)}`
                : `Scheduled for ${formatDateTime(post.scheduledFor)}`}
            </div>
            {post.platformUrl && (
              <a
                href={post.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View post
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.status === "PENDING" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePublishNow(post.id)}
              >
                <Play className="h-4 w-4 mr-1" />
                Publish Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancel(post.id)}
              >
                Cancel
              </Button>
            </>
          )}
          {post.status === "FAILED" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRetry(post.id)}
              >
                Retry
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancel(post.id)}
              >
                Remove
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="Schedule">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{upcomingPosts.length}</div>
                <div className="text-sm text-gray-500">Scheduled</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{publishedPosts.length}</div>
                <div className="text-sm text-gray-500">Published</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{failedPosts.length}</div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingPosts.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({publishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({failedPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="rounded-xl border border-gray-200 bg-white">
              {upcomingPosts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {upcomingPosts.map(renderPost)}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No scheduled posts
                  </h3>
                  <p className="text-gray-500">
                    Schedule posts from the post editor
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div className="rounded-xl border border-gray-200 bg-white">
              {publishedPosts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {publishedPosts.map(renderPost)}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No published posts yet
                  </h3>
                  <p className="text-gray-500">
                    Your published posts will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="failed">
            <div className="rounded-xl border border-gray-200 bg-white">
              {failedPosts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {failedPosts.map(renderPost)}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No failed posts
                  </h3>
                  <p className="text-gray-500">
                    All your scheduled posts are running smoothly
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
