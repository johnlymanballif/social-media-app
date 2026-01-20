"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UserPlus,
  MoreVertical,
  Mail,
  Clock,
  Crown,
  Shield,
  Eye,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TeamMember {
  id: string;
  userId: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Invite {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

const ROLE_INFO: Record<
  string,
  { icon: any; label: string; description: string; color: string }
> = {
  ADMIN: {
    icon: Crown,
    label: "Admin",
    description: "Full access to all features and settings",
    color: "bg-purple-100 text-purple-800",
  },
  EDITOR: {
    icon: Shield,
    label: "Editor",
    description: "Can create, edit, and schedule posts",
    color: "bg-blue-100 text-blue-800",
  },
  VIEWER: {
    icon: Eye,
    label: "Viewer",
    description: "Can view content and analytics",
    color: "bg-gray-100 text-gray-800",
  },
};

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: "1",
    userId: "1",
    role: "ADMIN",
    joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: "1", name: "John Doe", email: "john@example.com", image: null },
  },
  {
    id: "2",
    userId: "2",
    role: "EDITOR",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: "2", name: "Jane Smith", email: "jane@example.com", image: null },
  },
  {
    id: "3",
    userId: "3",
    role: "VIEWER",
    joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: "3", name: "Bob Wilson", email: "bob@example.com", image: null },
  },
];

const MOCK_INVITES: Invite[] = [
  {
    id: "1",
    email: "alice@example.com",
    role: "EDITOR",
    status: "PENDING",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [newInviteRole, setNewInviteRole] = useState<"ADMIN" | "EDITOR" | "VIEWER">(
    "EDITOR"
  );
  const [inviting, setInviting] = useState(false);

  async function handleInvite() {
    if (!newInviteEmail.trim()) return;
    setInviting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newInvite: Invite = {
      id: Date.now().toString(),
      email: newInviteEmail,
      role: newInviteRole,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setInvites([...invites, newInvite]);
    setNewInviteEmail("");
    setNewInviteRole("EDITOR");
    setShowInviteDialog(false);
    setInviting(false);
  }

  function handleCancelInvite(id: string) {
    setInvites(invites.filter((i) => i.id !== id));
  }

  function handleResendInvite(id: string) {
    setInvites(
      invites.map((i) =>
        i.id === id
          ? {
              ...i,
              expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              createdAt: new Date().toISOString(),
            }
          : i
      )
    );
  }

  function handleUpdateRole(memberId: string, newRole: "ADMIN" | "EDITOR" | "VIEWER") {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  }

  function handleRemoveMember(memberId: string) {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    setMembers(members.filter((m) => m.id !== memberId));
  }

  return (
    <DashboardLayout title="Team" showNewPost={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500">
            Manage your team members and their permissions
          </p>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    id="role"
                    value={newInviteRole}
                    onChange={(e) =>
                      setNewInviteRole(e.target.value as typeof newInviteRole)
                    }
                  >
                    <option value="ADMIN">Admin - Full access</option>
                    <option value="EDITOR">Editor - Create and edit posts</option>
                    <option value="VIEWER">Viewer - View only</option>
                  </Select>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium text-sm mb-2">Role permissions:</h4>
                  <p className="text-sm text-gray-600">
                    {ROLE_INFO[newInviteRole].description}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={inviting}>
                  {inviting ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Invites */}
        {invites.filter((i) => i.status === "PENDING").length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">
                Pending Invitations ({invites.filter((i) => i.status === "PENDING").length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {invites
                .filter((i) => i.status === "PENDING")
                .map((invite) => {
                  const roleInfo = ROLE_INFO[invite.role];
                  return (
                    <div
                      key={invite.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{invite.email}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            Invited {formatDate(invite.createdAt)} · Expires{" "}
                            {formatDate(invite.expiresAt)}
                          </span>
                        </div>
                      </div>
                      <Badge className={roleInfo.color} variant="secondary">
                        {roleInfo.label}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvite(invite.id)}
                        >
                          Resend
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvite(invite.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Team Members */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-medium">Team Members ({members.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {members.map((member) => {
              const roleInfo = ROLE_INFO[member.role];
              const RoleIcon = roleInfo.icon;
              const isCurrentUser = member.userId === "1"; // Mock current user

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <Avatar
                    src={member.user.image}
                    name={member.user.name || member.user.email}
                    size="lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {member.user.name || member.user.email}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-gray-500">(You)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.user.email} · Joined {formatDate(member.joinedAt)}
                    </div>
                  </div>
                  <Badge className={roleInfo.color} variant="secondary">
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {roleInfo.label}
                  </Badge>
                  {!isCurrentUser && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(member.id, e.target.value as any)
                        }
                        className="w-32"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="EDITOR">Editor</option>
                        <option value="VIEWER">Viewer</option>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium mb-4">Role Permissions</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(ROLE_INFO).map(([role, info]) => {
              const Icon = info.icon;
              return (
                <div
                  key={role}
                  className="rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{info.label}</span>
                  </div>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
