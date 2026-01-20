"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Link2,
  Unlink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SocialAccount {
  id: string;
  platform: string;
  accountId: string;
  accountName: string;
  expiresAt: string | null;
  createdAt: string;
  isConnected: boolean;
  _count: { publishedPosts: number; scheduledPosts: number };
}

const PLATFORM_INFO: Record<
  string,
  { icon: any; color: string; name: string; description: string }
> = {
  TWITTER: {
    icon: Twitter,
    color: "#1DA1F2",
    name: "Twitter/X",
    description: "Share tweets and threads with your audience",
  },
  LINKEDIN: {
    icon: Linkedin,
    color: "#0A66C2",
    name: "LinkedIn",
    description: "Post updates to your professional network",
  },
  FACEBOOK: {
    icon: Facebook,
    color: "#1877F2",
    name: "Facebook",
    description: "Share content on your Facebook page",
  },
  INSTAGRAM: {
    icon: Instagram,
    color: "#E4405F",
    name: "Instagram",
    description: "Share photos and stories with followers",
  },
};

const MOCK_ACCOUNTS: SocialAccount[] = [
  {
    id: "1",
    platform: "TWITTER",
    accountId: "tw_123",
    accountName: "@company",
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isConnected: true,
    _count: { publishedPosts: 45, scheduledPosts: 3 },
  },
  {
    id: "2",
    platform: "LINKEDIN",
    accountId: "li_456",
    accountName: "Company Page",
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isConnected: true,
    _count: { publishedPosts: 28, scheduledPosts: 2 },
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(MOCK_ACCOUNTS);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  async function handleConnect(platform: string) {
    setConnecting(platform);
    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const info = PLATFORM_INFO[platform];
    const newAccount: SocialAccount = {
      id: Date.now().toString(),
      platform,
      accountId: `${platform.toLowerCase()}_${Date.now()}`,
      accountName:
        platform === "TWITTER" ? "@new_account" : `${info.name} Account`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      isConnected: true,
      _count: { publishedPosts: 0, scheduledPosts: 0 },
    };

    setAccounts([...accounts, newAccount]);
    setConnecting(null);
    setShowConnectDialog(false);
  }

  async function handleDisconnect(id: string) {
    if (!confirm("Are you sure you want to disconnect this account?")) return;
    setAccounts(accounts.filter((a) => a.id !== id));
  }

  async function handleRefresh(id: string) {
    setAccounts(
      accounts.map((a) =>
        a.id === id
          ? {
              ...a,
              expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
          : a
      )
    );
  }

  const connectedPlatforms = accounts.map((a) => a.platform);
  const availablePlatforms = Object.keys(PLATFORM_INFO).filter(
    (p) => !connectedPlatforms.includes(p)
  );

  return (
    <DashboardLayout title="Connected Accounts" showNewPost={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500">
            Connect your social media accounts to start scheduling posts
          </p>
          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect a Social Account</DialogTitle>
                <DialogDescription>
                  Choose a platform to connect. You&apos;ll be redirected to
                  authorize access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {Object.entries(PLATFORM_INFO).map(([platform, info]) => {
                  const isConnected = connectedPlatforms.includes(platform);
                  const Icon = info.icon;
                  return (
                    <button
                      key={platform}
                      disabled={isConnected || connecting !== null}
                      onClick={() => handleConnect(platform)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        isConnected
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${info.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: info.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{info.name}</div>
                        <div className="text-sm text-gray-500">
                          {info.description}
                        </div>
                      </div>
                      {isConnected ? (
                        <Badge variant="secondary">Connected</Badge>
                      ) : connecting === platform ? (
                        <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
                      ) : (
                        <Link2 className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Connected Accounts */}
        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => {
              const info = PLATFORM_INFO[account.platform];
              const Icon = info.icon;
              const expiresIn = account.expiresAt
                ? Math.ceil(
                    (new Date(account.expiresAt).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null;
              const isExpiringSoon = expiresIn !== null && expiresIn <= 7;

              return (
                <div
                  key={account.id}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${info.color}20` }}
                    >
                      <Icon className="h-7 w-7" style={{ color: info.color }} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {account.accountName}
                        </h3>
                        <Badge variant="success" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {info.name} · Connected {formatDate(account.createdAt)}
                      </div>
                    </div>

                    <div className="text-right mr-6">
                      <div className="text-2xl font-semibold">
                        {account._count.publishedPosts}
                      </div>
                      <div className="text-sm text-gray-500">Posts published</div>
                    </div>

                    <div className="text-right mr-6">
                      <div className="text-2xl font-semibold">
                        {account._count.scheduledPosts}
                      </div>
                      <div className="text-sm text-gray-500">Scheduled</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefresh(account.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Unlink className="h-4 w-4 mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  </div>

                  {isExpiringSoon && (
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Access expires in {expiresIn} days. Refresh to renew
                        authorization.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Link2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No accounts connected
            </h3>
            <p className="text-gray-500 mb-4">
              Connect your social media accounts to start scheduling and publishing
              posts
            </p>
            <Button onClick={() => setShowConnectDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Your First Account
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
