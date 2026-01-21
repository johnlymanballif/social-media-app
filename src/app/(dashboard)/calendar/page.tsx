"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  alpha,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Event,
} from "@mui/icons-material";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface Campaign {
  id: string;
  name: string;
  color: string;
}

interface Post {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  campaign: { id: string; name: string; color: string } | null;
  scheduledPosts: { scheduledFor: string }[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  DRAFT: { label: "Draft", bg: "#F3F4F6", text: "#374151" },
  IN_REVIEW: { label: "In Review", bg: "#FEF3C7", text: "#92400E" },
  APPROVED: { label: "Approved", bg: "#D1FAE5", text: "#065F46" },
  SCHEDULED: { label: "Scheduled", bg: "#DBEAFE", text: "#1E40AF" },
  PUBLISHED: { label: "Published", bg: "#EDE9FE", text: "#5B21B6" },
  FAILED: { label: "Failed", bg: "#FEE2E2", text: "#991B1B" },
};

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "1", name: "Product Launch", color: "#3B82F6" },
  { id: "2", name: "Holiday Sale", color: "#10B981" },
];

const MOCK_POSTS: Post[] = [
  { id: "1", content: "Exciting news coming soon! Stay tuned for our biggest announcement yet.", status: "SCHEDULED", createdAt: new Date().toISOString(), campaign: { id: "1", name: "Product Launch", color: "#3B82F6" }, scheduledPosts: [{ scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() }] },
  { id: "2", content: "Check out our new features designed to help you work smarter!", status: "DRAFT", createdAt: new Date().toISOString(), campaign: { id: "1", name: "Product Launch", color: "#3B82F6" }, scheduledPosts: [] },
  { id: "3", content: "Early bird discounts are here! Don't miss out on our holiday deals.", status: "APPROVED", createdAt: new Date().toISOString(), campaign: { id: "2", name: "Holiday Sale", color: "#10B981" }, scheduledPosts: [{ scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() }] },
];

type ViewMode = "month" | "week" | "list";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDate = (date: Date) => {
    return MOCK_POSTS.filter((post) => {
      if (post.scheduledPosts.length > 0) {
        return post.scheduledPosts.some((sp) => isSameDay(new Date(sp.scheduledFor), date));
      }
      return isSameDay(new Date(post.createdAt), date);
    });
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

  return (
    <DashboardLayout title="Calendar">
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton size="small" onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft sx={{ fontSize: 20 }} /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, width: 180, textAlign: "center" }}>{format(currentDate, "MMMM yyyy")}</Typography>
            <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight sx={{ fontSize: 20 }} /></IconButton>
          </Box>
          <Button variant="outlined" size="small" onClick={() => setCurrentDate(new Date())} sx={{ borderRadius: 1.5 }}>Today</Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box className="segmented-control">
            <button className={`segmented-control-item ${viewMode === "month" ? "active" : ""}`} onClick={() => setViewMode("month")}>Month</button>
            <button className={`segmented-control-item ${viewMode === "week" ? "active" : ""}`} onClick={() => setViewMode("week")}>Week</button>
            <button className={`segmented-control-item ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>List</button>
          </Box>
          <Button variant="contained" size="small" startIcon={<Add sx={{ fontSize: 16 }} />} sx={{ borderRadius: 1.5 }}>New Campaign</Button>
        </Box>
      </Box>

      {/* Campaign legend */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        {MOCK_CAMPAIGNS.map((campaign) => (
          <Chip key={campaign.id} label={campaign.name} size="small" sx={{ bgcolor: alpha(campaign.color, 0.15), color: campaign.color, fontWeight: 500, fontSize: "12px" }} />
        ))}
      </Box>

      {/* Calendar */}
      <Paper sx={{ overflow: "hidden", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {/* Weekday headers */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid", borderColor: "divider" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Box key={day} sx={{ py: 1.5, textAlign: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary" }}>{day}</Typography>
            </Box>
          ))}
        </Box>

        {/* Calendar days */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {days.map((day, idx) => {
            const dayPosts = getPostsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <Box
                key={idx}
                onClick={() => setSelectedDate(day)}
                sx={{
                  minHeight: 100,
                  p: 1,
                  borderRight: idx % 7 !== 6 ? "1px solid" : "none",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                    bgcolor: isSelected ? alpha("#006686", 0.05) : isCurrentMonth ? "background.paper" : "grey.50",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: isSelected ? alpha("#006686", 0.08) : "grey.50" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? 600 : 400,
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      bgcolor: isToday ? "primary.main" : "transparent",
                      color: isToday ? "white" : "text.primary",
                    }}
                  >
                    {format(day, "d")}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {dayPosts.slice(0, 2).map((post) => {
                    const statusConfig = STATUS_CONFIG[post.status];
                    return (
                      <Box
                        key={post.id}
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 0.75,
                          fontSize: "11px",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          bgcolor: post.campaign ? alpha(post.campaign.color, 0.15) : "#F3F4F6",
                          color: post.campaign?.color || "#374151",
                        }}
                      >
                        {post.content.slice(0, 18)}...
                      </Box>
                    );
                  })}
                  {dayPosts.length > 2 && (
                    <Typography variant="caption" sx={{ color: "text.secondary", pl: 0.5 }}>+{dayPosts.length - 2} more</Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Selected day panel */}
      {selectedDate && (
        <Paper sx={{ mt: 3, p: 3, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{format(selectedDate, "EEEE, MMMM d, yyyy")}</Typography>
          {selectedDatePosts.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {selectedDatePosts.map((post) => {
                const statusConfig = STATUS_CONFIG[post.status];
                return (
                  <Paper
                    key={post.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                      transition: "all 0.15s ease",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        {post.campaign && <Chip label={post.campaign.name} size="small" sx={{ height: 20, fontSize: "11px", bgcolor: alpha(post.campaign.color, 0.15), color: post.campaign.color }} />}
                        <Chip label={statusConfig.label} size="small" sx={{ height: 20, fontSize: "11px", bgcolor: statusConfig.bg, color: statusConfig.text }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{post.content}</Typography>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 1.5 }}>Edit</Button>
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Event sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>No posts scheduled for this day</Typography>
              <Button variant="outlined" startIcon={<Add />} sx={{ borderRadius: 1.5 }}>Create Post</Button>
            </Box>
          )}
        </Paper>
      )}
    </DashboardLayout>
  );
}
