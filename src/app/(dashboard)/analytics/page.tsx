"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MousePointer,
  Users,
  Download,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import { formatDate, PLATFORM_COLORS } from "@/lib/utils";

const ENGAGEMENT_DATA = [
  { date: "Jan 1", impressions: 12500, engagements: 850, clicks: 120 },
  { date: "Jan 8", impressions: 15800, engagements: 920, clicks: 145 },
  { date: "Jan 15", impressions: 14200, engagements: 780, clicks: 98 },
  { date: "Jan 22", impressions: 18900, engagements: 1100, clicks: 210 },
  { date: "Jan 29", impressions: 21500, engagements: 1350, clicks: 280 },
  { date: "Feb 5", impressions: 19800, engagements: 1180, clicks: 195 },
  { date: "Feb 12", impressions: 24100, engagements: 1520, clicks: 320 },
];

const PLATFORM_DATA = [
  { name: "Twitter/X", value: 35, color: PLATFORM_COLORS.TWITTER },
  { name: "LinkedIn", value: 30, color: PLATFORM_COLORS.LINKEDIN },
  { name: "Facebook", value: 20, color: PLATFORM_COLORS.FACEBOOK },
  { name: "Instagram", value: 15, color: PLATFORM_COLORS.INSTAGRAM },
];

const TOP_POSTS = [
  {
    id: "1",
    content: "Exciting news coming soon! Stay tuned for our biggest announcement yet.",
    platform: "TWITTER",
    impressions: 15420,
    engagements: 890,
    likes: 542,
    comments: 78,
    shares: 124,
  },
  {
    id: "2",
    content: "Check out our latest blog post on productivity tips for remote teams!",
    platform: "LINKEDIN",
    impressions: 12800,
    engagements: 720,
    likes: 456,
    comments: 89,
    shares: 67,
  },
  {
    id: "3",
    content: "Thank you to our amazing customers for helping us reach 10K followers!",
    platform: "INSTAGRAM",
    impressions: 9500,
    engagements: 650,
    likes: 520,
    comments: 45,
    shares: 32,
  },
];

const PLATFORM_ICONS: Record<string, any> = {
  TWITTER: Twitter,
  LINKEDIN: Linkedin,
  FACEBOOK: Facebook,
  INSTAGRAM: Instagram,
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const stats = [
    {
      label: "Total Impressions",
      value: "127.5K",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
    },
    {
      label: "Total Engagements",
      value: "7.6K",
      change: "+8.2%",
      trend: "up",
      icon: Heart,
    },
    {
      label: "Total Clicks",
      value: "1.4K",
      change: "-3.1%",
      trend: "down",
      icon: MousePointer,
    },
    {
      label: "Reach",
      value: "98.2K",
      change: "+15.7%",
      trend: "up",
      icon: Users,
    },
  ];

  return (
    <DashboardLayout title="Analytics" showNewPost={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">
              Track your social media performance across all platforms
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last year</option>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Engagement Over Time */}
          <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium mb-6">Engagement Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ENGAGEMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  name="Impressions"
                />
                <Line
                  type="monotone"
                  dataKey="engagements"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Engagements"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium mb-6">Engagement by Platform</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={PLATFORM_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PLATFORM_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {PLATFORM_DATA.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium mb-6">Top Performing Posts</h3>
          <div className="space-y-4">
            {TOP_POSTS.map((post, index) => {
              const PlatformIcon = PLATFORM_ICONS[post.platform];
              return (
                <div
                  key={post.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-300">
                      #{index + 1}
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <PlatformIcon className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {((post.engagements / post.impressions) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">Engagement Rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
