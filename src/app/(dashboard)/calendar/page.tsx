"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  color: string;
  startDate: string | null;
  endDate: string | null;
}

interface Post {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  campaign: { id: string; name: string; color: string } | null;
  scheduledPosts: { scheduledFor: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  PUBLISHED: "bg-purple-100 text-purple-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);

  // For demo, we'll use a mock workspace ID
  const workspaceId = "demo-workspace";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // In production, these would be real API calls
      // For demo, using mock data
      setCampaigns([
        {
          id: "1",
          name: "Product Launch",
          description: "Q1 product launch campaign",
          color: "#3B82F6",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          name: "Holiday Sale",
          description: "End of year promotion",
          color: "#10B981",
          startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

      setPosts([
        {
          id: "1",
          content: "Exciting news coming soon! Stay tuned for our biggest announcement yet.",
          status: "SCHEDULED",
          createdAt: new Date().toISOString(),
          campaign: { id: "1", name: "Product Launch", color: "#3B82F6" },
          scheduledPosts: [
            { scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
          ],
        },
        {
          id: "2",
          content: "Check out our new features designed to help you work smarter!",
          status: "DRAFT",
          createdAt: new Date().toISOString(),
          campaign: { id: "1", name: "Product Launch", color: "#3B82F6" },
          scheduledPosts: [],
        },
        {
          id: "3",
          content: "Early bird discounts are here! Don't miss out on our holiday deals.",
          status: "APPROVED",
          createdAt: new Date().toISOString(),
          campaign: { id: "2", name: "Holiday Sale", color: "#10B981" },
          scheduledPosts: [
            { scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
          ],
        },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function getPostsForDate(date: Date) {
    return posts.filter((post) => {
      if (post.scheduledPosts.length > 0) {
        return post.scheduledPosts.some((sp) =>
          isSameDay(new Date(sp.scheduledFor), date)
        );
      }
      return isSameDay(new Date(post.createdAt), date);
    });
  }

  function handleCreateCampaign() {
    // In production, would call API
    const campaign: Campaign = {
      id: Date.now().toString(),
      ...newCampaign,
    };
    setCampaigns([...campaigns, campaign]);
    setNewCampaign({ name: "", description: "", color: "#3B82F6", startDate: "", endDate: "" });
    setShowCampaignDialog(false);
  }

  return (
    <DashboardLayout title="Content Calendar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold w-40 text-center">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>

          <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={newCampaign.name}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, name: e.target.value })
                    }
                    placeholder="e.g., Summer Sale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCampaign.description}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, description: e.target.value })
                    }
                    placeholder="What's this campaign about?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) =>
                        setNewCampaign({ ...newCampaign, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) =>
                        setNewCampaign({ ...newCampaign, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"].map(
                      (color) => (
                        <button
                          key={color}
                          className={cn(
                            "h-8 w-8 rounded-full border-2",
                            newCampaign.color === color
                              ? "border-gray-900"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCampaign({ ...newCampaign, color })}
                        />
                      )
                    )}
                  </div>
                </div>
                <Button onClick={handleCreateCampaign} className="w-full">
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Legend */}
        <div className="flex flex-wrap gap-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center gap-2 rounded-full px-3 py-1 text-sm"
              style={{ backgroundColor: `${campaign.color}20`, color: campaign.color }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: campaign.color }}
              />
              {campaign.name}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayPosts = getPostsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[120px] border-b border-r border-gray-100 p-2 cursor-pointer transition-colors",
                    !isCurrentMonth && "bg-gray-50",
                    isSelected && "bg-blue-50",
                    "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm",
                        !isCurrentMonth && "text-gray-400",
                        isToday &&
                          "flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="rounded px-1.5 py-0.5 text-xs truncate"
                        style={{
                          backgroundColor: post.campaign
                            ? `${post.campaign.color}20`
                            : "#f3f4f6",
                          color: post.campaign?.color || "#374151",
                        }}
                      >
                        {post.content.slice(0, 25)}...
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{dayPosts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Posts */}
        {selectedDate && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            {getPostsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getPostsForDate(selectedDate).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                        <Badge
                          className={STATUS_COLORS[post.status]}
                          variant="secondary"
                        >
                          {post.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-gray-900">{post.content}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No posts scheduled for this day</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
