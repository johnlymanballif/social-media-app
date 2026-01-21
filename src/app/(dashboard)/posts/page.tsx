"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Divider,
  alpha,
} from "@mui/material";
import {
  Search,
  Add,
  MoreVert,
  ChatBubbleOutline,
  Event,
  VisibilityOutlined,
} from "@mui/icons-material";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

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

const STATUS_CONFIG: Record<string, { label: string; color: "default" | "error" | "warning" | "success" | "info"; bg: string; text: string }> = {
  DRAFT: { label: "Draft", color: "default", bg: "#F3F4F6", text: "#374151" },
  IN_REVIEW: { label: "In Review", color: "warning", bg: "#FEF3C7", text: "#92400E" },
  APPROVED: { label: "Approved", color: "success", bg: "#D1FAE5", text: "#065F46" },
  SCHEDULED: { label: "Scheduled", color: "info", bg: "#DBEAFE", text: "#1E40AF" },
  PUBLISHED: { label: "Published", color: "success", bg: "#EDE9FE", text: "#5B21B6" },
  FAILED: { label: "Failed", color: "error", bg: "#FEE2E2", text: "#991B1B" },
};

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    content: "Exciting news coming soon! Stay tuned for our biggest announcement yet. We've been working on something special for months. #innovation #startup",
    status: "SCHEDULED",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { id: "1", name: "John Doe", email: "john@example.com", image: null },
    campaign: { id: "1", name: "Product Launch", color: "#3B82F6" },
    scheduledPosts: [
      { scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), socialAccount: { platform: "TWITTER", accountName: "@company" } },
      { scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), socialAccount: { platform: "LINKEDIN", accountName: "Company Page" } },
    ],
    _count: { comments: 3, publishedPosts: 0 },
  },
  {
    id: "2",
    content: "Check out our new features designed to help you work smarter, not harder! Link in bio.",
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
    content: "Early bird discounts are here! Don't miss out on our holiday deals. Save up to 50% on all products.",
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
    content: "Thank you to our amazing customers for helping us reach 10,000 followers! Here's to many more milestones together.",
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    creator: { id: "2", name: "Jane Smith", email: "jane@example.com", image: null },
    campaign: null,
    scheduledPosts: [],
    _count: { comments: 0, publishedPosts: 3 },
  },
];

const STATUS_TABS = [
  { value: "all", label: "All", count: MOCK_POSTS.length },
  { value: "DRAFT", label: "Drafts", count: MOCK_POSTS.filter((p) => p.status === "DRAFT").length },
  { value: "IN_REVIEW", label: "In Review", count: MOCK_POSTS.filter((p) => p.status === "IN_REVIEW").length },
  { value: "SCHEDULED", label: "Scheduled", count: MOCK_POSTS.filter((p) => p.status === "SCHEDULED").length },
  { value: "PUBLISHED", label: "Published", count: MOCK_POSTS.filter((p) => p.status === "PUBLISHED").length },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function truncateText(text: string, maxLength = 120) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export default function PostsPage() {
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || post.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <DashboardLayout title="Posts">
      {/* Filter bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search posts..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Box className="segmented-control">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`segmented-control-item ${activeTab === tab.value ? "active" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </Box>
      </Box>

      {/* Posts list - dense rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {filteredPosts.map((post) => {
          const statusConfig = STATUS_CONFIG[post.status];
          return (
            <Paper
              key={post.id}
              component={Link}
              href={`/posts/${post.id}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "white",
                textDecoration: "none",
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                },
              }}
            >
              {/* Avatar */}
              <Avatar
                src={post.creator.image || undefined}
                sx={{ width: 32, height: 32, fontSize: "12px" }}
              >
                {(post.creator.name || post.creator.email).charAt(0).toUpperCase()}
              </Avatar>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {post.creator.name || post.creator.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(post.updatedAt)}
                  </Typography>
                  <Chip
                    label={statusConfig.label}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "11px",
                      fontWeight: 500,
                      bgcolor: statusConfig.bg,
                      color: statusConfig.text,
                    }}
                  />
                  {post.campaign && (
                    <Chip
                      label={post.campaign.name}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        fontSize: "11px",
                        borderColor: alpha(post.campaign.color, 0.3),
                        color: post.campaign.color,
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncateText(post.content)}
                </Typography>
              </Box>

              {/* Meta info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {post.scheduledPosts.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Event sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.scheduledPosts[0].scheduledFor)}
                    </Typography>
                  </Box>
                )}
                {post._count.comments > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ChatBubbleOutline sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post._count.comments}
                    </Typography>
                  </Box>
                )}
                {post._count.publishedPosts > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VisibilityOutlined sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {post._count.publishedPosts}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Actions */}
              <IconButton
                size="small"
                sx={{
                  opacity: 0,
                  transition: "opacity 0.15s ease",
                  ".group:hover &": { opacity: 1 },
                }}
              >
                <MoreVert sx={{ fontSize: 18 }} />
              </IconButton>
            </Paper>
          );
        })}

        {filteredPosts.length === 0 && (
          <Box className="empty-state">
            <Box className="empty-state-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Box>
            <Typography className="empty-state-title">No posts found</Typography>
            <Typography className="empty-state-description">
              {searchQuery ? "Try adjusting your search" : "Create your first post to get started"}
            </Typography>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}
