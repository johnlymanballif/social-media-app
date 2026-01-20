"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  MessageSquare,
  Calendar,
  Eye,
} from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  campaign: { id: string; name: string; color: string } | null;
  scheduledPosts: {
    scheduledFor: string;
    socialAccount: { platform: string; accountName: string };
  }[];
  _count: { comments: number; publishedPosts: number };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  PUBLISHED: "bg-purple-100 text-purple-800",
  FAILED: "bg-red-100 text-red-800",
};

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    content:
      "Exciting news coming soon! Stay tuned for our biggest announcement yet. We've been working on something special for months. #innovation #startup",
    status: "SCHEDULED",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { id: "1", name: "John Doe", email: "john@example.com", image: null },
    campaign: { id: "1", name: "Product Launch", color: "#3B82F6" },
    scheduledPosts: [
      {
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        socialAccount: { platform: "TWITTER", accountName: "@company" },
      },
      {
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        socialAccount: { platform: "LINKEDIN", accountName: "Company Page" },
      },
    ],
    _count: { comments: 3, publishedPosts: 0 },
  },
  {
    id: "2",
    content:
      "Check out our new features designed to help you work smarter, not harder! Link in bio.",
    status: "DRAFT",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    creator: { id: "2", name: "Jane Smith", email: "jane@example.com", image: null },
    campaign: { id: "1", name: "Product Launch", color: "#3B82F6" },
    scheduledPosts: [],
    _count: { comments: 1, publishedPosts: 0 },
  },
  {
    id: "3",
    content:
      "Early bird discounts are here! Don't miss out on our holiday deals. Save up to 50% on all products.",
    status: "IN_REVIEW",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    creator: { id: "1", name: "John Doe", email: "john@example.com", image: null },
    campaign: { id: "2", name: "Holiday Sale", color: "#10B981" },
    scheduledPosts: [],
    _count: { comments: 5, publishedPosts: 0 },
  },
  {
    id: "4",
    content:
      "Thank you to our amazing customers for helping us reach 10,000 followers! Here's to many more milestones together.",
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { id: "2", name: "Jane Smith", email: "jane@example.com", image: null },
    campaign: null,
    scheduledPosts: [],
    _count: { comments: 0, publishedPosts: 3 },
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesCampaign =
      campaignFilter === "all" ||
      (campaignFilter === "none" && !post.campaign) ||
      post.campaign?.id === campaignFilter;
    return matchesSearch && matchesStatus && matchesCampaign;
  });

  const postsByStatus = {
    all: posts,
    DRAFT: posts.filter((p) => p.status === "DRAFT"),
    IN_REVIEW: posts.filter((p) => p.status === "IN_REVIEW"),
    APPROVED: posts.filter((p) => p.status === "APPROVED"),
    SCHEDULED: posts.filter((p) => p.status === "SCHEDULED"),
    PUBLISHED: posts.filter((p) => p.status === "PUBLISHED"),
  };

  return (
    <DashboardLayout title="Posts">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
          >
            <option value="all">All Campaigns</option>
            <option value="none">No Campaign</option>
            <option value="1">Product Launch</option>
            <option value="2">Holiday Sale</option>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">
              All ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="DRAFT">
              Drafts ({postsByStatus.DRAFT.length})
            </TabsTrigger>
            <TabsTrigger value="IN_REVIEW">
              In Review ({postsByStatus.IN_REVIEW.length})
            </TabsTrigger>
            <TabsTrigger value="APPROVED">
              Approved ({postsByStatus.APPROVED.length})
            </TabsTrigger>
            <TabsTrigger value="SCHEDULED">
              Scheduled ({postsByStatus.SCHEDULED.length})
            </TabsTrigger>
            <TabsTrigger value="PUBLISHED">
              Published ({postsByStatus.PUBLISHED.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar
                        name={post.creator.name || post.creator.email}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {post.creator.name || post.creator.email}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(post.updatedAt)}
                          </span>
                          <Badge
                            className={STATUS_COLORS[post.status]}
                            variant="secondary"
                          >
                            {post.status.replace("_", " ")}
                          </Badge>
                          {post.campaign && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${post.campaign.color}20`,
                                color: post.campaign.color,
                              }}
                            >
                              {post.campaign.name}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-900 mb-4">{post.content}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          {post.scheduledPosts.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Scheduled for{" "}
                                {formatDate(post.scheduledPosts[0].scheduledFor)}
                              </span>
                              {post.scheduledPosts.length > 1 && (
                                <span className="text-gray-400">
                                  +{post.scheduledPosts.length - 1} more
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post._count.comments} comments</span>
                          </div>
                          {post._count.publishedPosts > 0 && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>
                                Published to {post._count.publishedPosts} platforms
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/posts/${post.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first post to get started"}
                </p>
                <Link href="/posts/new">
                  <Button>Create Post</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
