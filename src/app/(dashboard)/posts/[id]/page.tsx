"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Chip,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
} from "@mui/material";
import {
  ArrowBack,
  Schedule,
  Check,
  Close,
  Visibility,
  ChatBubbleOutline,
  Edit,
  CheckCircleOutline,
} from "@mui/icons-material";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MediaCarousel, type MediaItem } from "@/components/posts/MediaCarousel";
import { SocialPreview } from "@/components/posts/SocialPreviews";
import { PlatformContentEditor } from "@/components/posts/PlatformContentEditor";
import { usePlatformContent } from "@/hooks/usePlatformContent";
import { Platform, PlatformContent as PlatformContentType } from "@/types";

const STATUS_CONFIG: Record<string, { color: "default" | "warning" | "success" | "info" | "error"; label: string }> = {
  DRAFT: { color: "default", label: "Draft" },
  IN_REVIEW: { color: "warning", label: "In Review" },
  APPROVED: { color: "success", label: "Approved" },
  SCHEDULED: { color: "info", label: "Scheduled" },
  PUBLISHED: { color: "success", label: "Published" },
  FAILED: { color: "error", label: "Failed" },
};

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; email: string; image: string | null };
}

const PLATFORMS = ["TWITTER", "LINKEDIN", "FACEBOOK", "INSTAGRAM"] as const;
type PlatformType = (typeof PLATFORMS)[number];

const PLATFORM_LABELS: Record<PlatformType, string> = {
  TWITTER: "X",
  LINKEDIN: "LinkedIn",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
};

const EDITOR_TABS = ["default", ...PLATFORMS] as const;
type EditorTab = (typeof EDITOR_TABS)[number];

export default function PostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState("DRAFT");
  const [campaignId, setCampaignId] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<PlatformType>("TWITTER");
  const [showComments, setShowComments] = useState(false);
  const [editorTab, setEditorTab] = useState<EditorTab>("default");

  const {
    platformContents,
    isLoading: isLoadingPlatformContent,
    isSaving: isSavingPlatformContent,
    getPlatformContent,
    updatePlatformContent,
    resetPlatformContent,
    isPlatformCustomized,
  } = usePlatformContent({
    postId: params.id as string,
    initialContent: content,
    initialMediaUrls: media.map((m) => m.url),
    onError: (error) => {
      console.error("Platform content error:", error);
    },
  });

  useEffect(() => {
    if (!isNew) {
      setContent(
        "Exciting news coming soon! Stay tuned for our biggest announcement yet. We've been working on something special for months. #innovation #startup"
      );
      setStatus("DRAFT");
      setCampaignId("1");
      setComments([
        { id: "1", content: "Great post! Maybe we should add a CTA?", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), author: { id: "2", name: "Jane Smith", email: "jane@example.com", image: null } },
        { id: "2", content: "I think we should schedule this for Tuesday morning.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), author: { id: "3", name: "Bob Wilson", email: "bob@example.com", image: null } },
      ]);
      setMedia([{ id: "1", url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop", type: "image", alt: "Tech workspace" }]);
    }
  }, [isNew]);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (isNew) router.push("/posts");
    }, 1000);
  }, [isNew, router]);

  const handleSubmitForReview = () => {
    setStatus("IN_REVIEW");
    handleSave();
  };

  const handleApprove = () => {
    setStatus("APPROVED");
    handleSave();
  };

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime || selectedPlatforms.length === 0) {
      alert("Please select date, time, and at least one platform");
      return;
    }
    setStatus("SCHEDULED");
    handleSave();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now().toString(), content: newComment, createdAt: new Date().toISOString(), author: { id: "1", name: "John Doe", email: "john@example.com", image: null } }]);
    setNewComment("");
  };

  const togglePlatform = (platform: PlatformType) => {
    setSelectedPlatforms((prev) => prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]);
  };

  const handlePlatformContentChange = useCallback(
    async (platform: PlatformType, data: { content: string; mediaUrls: string[]; excluded: boolean }) => {
      await updatePlatformContent(platform, { content: data.content, mediaUrls: data.mediaUrls as any, excluded: data.excluded });
    },
    [updatePlatformContent]
  );

  const handleResetPlatformContent = useCallback(
    async (platform: PlatformType) => {
      await resetPlatformContent(platform);
    },
    [resetPlatformContent]
  );

  const getEditorContent = () => {
    if (editorTab === "default") return { content, media };
    const platform = editorTab as PlatformType;
    const platformContent = getPlatformContent(platform);
    return {
      content: platformContent.content,
      media: platformContent.mediaUrls.map((url, index) => ({ id: `${platform}-${index}`, url, type: "image" as const, alt: "" })),
    };
  };

  const editorContent = getEditorContent();
  const isTabCustomized = (tab: EditorTab) => tab !== "default" && isPlatformCustomized(tab as PlatformType);

  return (
    <DashboardLayout title={isNew ? "New Post" : "Edit Post"} showNewPost={false}>
      <Box sx={{ height: "calc(100vh - 64px - 48px)", display: "flex", flexDirection: "column" }}>
        {/* Compact header */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 1.5,
            borderRadius: 0,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton component={Link} href="/posts" size="small"><ArrowBack sx={{ fontSize: 20 }} /></IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {isNew ? "New Post" : "Edit Post"}
              </Typography>
              {!isNew && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label={STATUS_CONFIG[status].label} size="small" sx={{ height: 22, fontSize: "11px", fontWeight: 500, bgcolor: STATUS_CONFIG[status].color === "default" ? "#F3F4F6" : undefined, color: STATUS_CONFIG[status].color === "default" ? "#374151" : undefined }} />
                  <Typography variant="caption" color="text.secondary">Saved</Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {!isNew && (
              <Button variant="outlined" size="small" startIcon={<ChatBubbleOutline sx={{ fontSize: 16 }} />} onClick={() => setShowComments(!showComments)} sx={{ borderRadius: 1.5 }}>
                Comments {comments.length > 0 && <Chip label={comments.length} size="small" color="primary" sx={{ ml: 0.5, height: 18, fontSize: "0.65rem" }} />}
              </Button>
            )}
            {status === "DRAFT" && (
              <>
                <Button variant="outlined" size="small" onClick={handleSave} disabled={saving} sx={{ borderRadius: 1.5 }}>{saving ? "Saving..." : "Save Draft"}</Button>
                <Button variant="contained" size="small" onClick={handleSubmitForReview} disabled={saving} sx={{ borderRadius: 1.5 }}>Submit for Review</Button>
              </>
            )}
            {status === "IN_REVIEW" && (
              <>
                <Button variant="outlined" size="small" color="error" startIcon={<Close sx={{ fontSize: 16 }} />} onClick={() => setStatus("DRAFT")} sx={{ borderRadius: 1.5 }}>Request Changes</Button>
                <Button variant="contained" size="small" startIcon={<Check sx={{ fontSize: 16 }} />} onClick={handleApprove} sx={{ borderRadius: 1.5 }}>Approve</Button>
              </>
            )}
            {status === "APPROVED" && (
              <Button variant="contained" size="small" startIcon={<Schedule sx={{ fontSize: 16 }} />} onClick={handleSchedule} sx={{ borderRadius: 1.5 }}>Schedule</Button>
            )}
          </Box>
        </Paper>

        {/* Main content */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Editor panel */}
          <Box sx={{ width: "50%", borderRight: "1px solid", borderColor: "divider", overflow: "auto", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
            {/* Platform tabs - segmented control */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
              <Box className="segmented-control">
                <button className={`segmented-control-item ${editorTab === "default" ? "active" : ""}`} onClick={() => setEditorTab("default")}>
                  <Edit sx={{ fontSize: 14, mr: 0.5 }} /> Default
                </button>
                {PLATFORMS.map((platform) => (
                  <button key={platform} className={`segmented-control-item ${editorTab === platform ? "active" : ""}`} onClick={() => setEditorTab(platform)}>
                    {PLATFORM_LABELS[platform]}
                    {isTabCustomized(platform) && <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main", ml: 0.5 }} />}
                  </button>
                ))}
              </Box>
            </Box>

            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
              {editorTab === "default" ? (
                <>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Media</Typography>
                      <Typography variant="caption" color="text.secondary">{media.length} items</Typography>
                    </Box>
                    <MediaCarousel media={media} onMediaChange={setMedia} maxItems={10} />
                  </Box>

                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Caption</Typography>
                      <Typography variant="caption" color={content.length > 280 ? "error" : "text.secondary"}>{content.length} characters</Typography>
                    </Box>
                    <TextField
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your caption..."
                      multiline
                      rows={6}
                      fullWidth
                      sx={{ "& .MuiOutlinedInput-root": { fontSize: "14px" } }}
                    />
                  </Box>
                </>
              ) : (
                <PlatformContentEditor
                  platform={editorTab as PlatformType}
                  globalContent={content}
                  globalMedia={media}
                  platformContent={platformContents.find((pc) => pc.platform === editorTab) as PlatformContentType | undefined}
                  onContentChange={(data) => handlePlatformContentChange(editorTab as PlatformType, data)}
                  onReset={() => handleResetPlatformContent(editorTab as PlatformType)}
                  isSaving={isSavingPlatformContent}
                />
              )}

              <Divider />

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Campaign</InputLabel>
                  <Select value={campaignId} label="Campaign" onChange={(e) => setCampaignId(e.target.value)}>
                    <MenuItem value="">No Campaign</MenuItem>
                    <MenuItem value="1">Product Launch</MenuItem>
                    <MenuItem value="2">Holiday Sale</MenuItem>
                    <MenuItem value="3">Brand Awareness</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Schedule</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField type="date" label="Date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" />
                  <TextField type="time" label="Time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Publish to</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  {PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <Paper
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: isSelected ? alpha("#006686", 0.04) : "background.paper",
                          borderRadius: 1.5,
                          transition: "all 0.15s ease",
                        }}
                      >
                        <PlatformIcon platform={platform} />
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: isSelected ? "primary.main" : "text.primary" }}>{PLATFORM_LABELS[platform]}</Typography>
                        {isSelected && <Check sx={{ fontSize: 16, color: "primary.main" }} />}
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Preview panel */}
          <Box sx={{ width: "50%", display: "flex", flexDirection: "column", bgcolor: "grey.50" }}>
            <Box sx={{ px: 3, py: 2, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Visibility sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography variant="subtitle2" color="text.secondary">Preview</Typography>
              </Box>
              <Box className="segmented-control">
                {PLATFORMS.map((platform) => (
                  <button key={platform} className={`segmented-control-item ${activePreviewPlatform === platform ? "active" : ""}`} onClick={() => setActivePreviewPlatform(platform)}>
                    {PLATFORM_LABELS[platform]}
                  </button>
                ))}
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
              <Box sx={{ maxWidth: 420, mx: "auto" }}>
                <SocialPreview platform={activePreviewPlatform} content={editorContent.content} media={editorContent.media} userName="Your Name" userHandle="yourhandle" />
              </Box>
            </Box>
          </Box>

          {/* Comments sidebar */}
          {showComments && !isNew && (
            <Box sx={{ width: 320, borderLeft: "1px solid", borderColor: "divider", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Comments ({comments.length})</Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                {comments.map((comment) => (
                  <Box key={comment.id} sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: "11px" }}>{(comment.author.name || comment.author.email).charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{comment.author.name || comment.author.email}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(comment.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "13px" }}>{comment.content}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField placeholder="Add a comment..." size="small" fullWidth value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()} />
                  <IconButton color="primary" onClick={handleAddComment} disabled={!newComment.trim()}><CheckCircleOutline /></IconButton>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const iconStyle = { width: 18, height: 18 };
  switch (platform) {
    case "TWITTER": return <svg style={iconStyle} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
    case "LINKEDIN": return <svg style={{ ...iconStyle, color: "#0A66C2" }} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg>;
    case "FACEBOOK": return <svg style={{ ...iconStyle, color: "#1877F2" }} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
    case "INSTAGRAM": return <svg style={{ ...iconStyle, color: "#E4405F" }} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>;
    default: return null;
  }
}
