"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Save, Upload } from "lucide-react";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [workspaceSlug, setWorkspaceSlug] = useState("my-workspace");
  const [workspaceDescription, setWorkspaceDescription] = useState(
    "Our team's social media command center"
  );

  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john@example.com");

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  }

  return (
    <DashboardLayout title="Settings" showNewPost={false}>
      <div className="max-w-3xl">
        <Tabs defaultValue="workspace">
          <TabsList>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace">
            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium mb-6">Workspace Settings</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspaceSlug">Workspace URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">socialhub.app/</span>
                    <Input
                      id="workspaceSlug"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspaceDescription">Description</Label>
                  <Textarea
                    id="workspaceDescription"
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                Danger Zone
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Once you delete a workspace, there is no going back. Please be
                certain.
              </p>
              <Button variant="destructive">Delete Workspace</Button>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium mb-6">Profile Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar name={userName} size="lg" />
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium mb-6">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button>Update Password</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium mb-6">
                Notification Preferences
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Post published",
                    description: "Get notified when a scheduled post is published",
                  },
                  {
                    title: "Post failed",
                    description: "Get notified when a post fails to publish",
                  },
                  {
                    title: "New comment",
                    description: "Get notified when someone comments on your post",
                  },
                  {
                    title: "Post approved",
                    description: "Get notified when your post is approved",
                  },
                  {
                    title: "Team invite",
                    description: "Get notified when you're invited to a workspace",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium mb-6">Current Plan</h3>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                <div>
                  <div className="font-semibold text-lg">Pro Plan</div>
                  <div className="text-gray-600">
                    Unlimited posts, 5 team members, all platforms
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">$29</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Button variant="outline">Change Plan</Button>
                <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                  Cancel Subscription
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
              <h3 className="text-lg font-medium mb-6">Billing History</h3>
              <div className="space-y-4">
                {[
                  { date: "Jan 1, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Dec 1, 2023", amount: "$29.00", status: "Paid" },
                  { date: "Nov 1, 2023", amount: "$29.00", status: "Paid" },
                ].map((invoice, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="font-medium">{invoice.date}</div>
                      <div className="text-sm text-gray-500">Pro Plan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{invoice.amount}</div>
                      <div className="text-sm text-green-600">{invoice.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
