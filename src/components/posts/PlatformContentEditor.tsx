"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Button,
  alpha,
} from "@mui/material";
import {
  RestartAlt,
  ContentCopy,
} from "@mui/icons-material";
import { Platform, PlatformContent as PlatformContentType } from "@/types";
import { MediaCarousel, type MediaItem } from "./MediaCarousel";
import { getPlatformConfig } from "@/lib/social/platform-config";

interface PlatformContentEditorProps {
  platform: Platform;
  globalContent: string;
  globalMedia: MediaItem[];
  platformContent?: PlatformContentType;
  onContentChange: (data: { content: string; mediaUrls: string[]; excluded: boolean }) => void;
  onReset: () => void;
  isSaving?: boolean;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  TWITTER: "X (Twitter)",
  LINKEDIN: "LinkedIn",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  TWITTER: "#1DA1F2",
  LINKEDIN: "#0A66C2",
  FACEBOOK: "#1877F2",
  INSTAGRAM: "#E4405F",
};

export function PlatformContentEditor({
  platform,
  globalContent,
  globalMedia,
  platformContent,
  onContentChange,
  onReset,
  isSaving = false,
}: PlatformContentEditorProps) {
  const config = getPlatformConfig(platform);
  const isCustomized = !!platformContent;

  const [content, setContent] = useState(platformContent?.content || globalContent);
  const [media, setMedia] = useState<MediaItem[]>(
    platformContent?.mediaUrls
      ? (() => {
          try {
            const urls = JSON.parse(platformContent.mediaUrls);
            return urls.map((url: string, index: number) => ({
              id: `${platform}-${index}`,
              url,
              type: "image" as const,
              alt: "",
            }));
          } catch {
            return globalMedia;
          }
        })()
      : globalMedia
  );
  const [excluded, setExcluded] = useState(platformContent?.excluded || false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(platformContent?.content || globalContent);
    if (platformContent?.mediaUrls) {
      try {
        const urls = JSON.parse(platformContent.mediaUrls);
        setMedia(
          urls.map((url: string, index: number) => ({
            id: `${platform}-${index}`,
            url,
            type: "image" as const,
            alt: "",
          }))
        );
      } catch {
        setMedia(globalMedia);
      }
    } else {
      setMedia(globalMedia);
    }
    setExcluded(platformContent?.excluded || false);
  }, [platformContent, globalContent, globalMedia, platform]);

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      setHasChanges(true);
      const mediaUrls = media.map((m) => m.url);
      onContentChange({ content: newContent, mediaUrls, excluded });
    },
    [media, excluded, onContentChange]
  );

  const handleMediaChange = useCallback(
    (newMedia: MediaItem[]) => {
      setMedia(newMedia);
      setHasChanges(true);
      const mediaUrls = newMedia.map((m) => m.url);
      onContentChange({ content, mediaUrls, excluded });
    },
    [content, excluded, onContentChange]
  );

  const handleExcludedChange = useCallback(
    (newExcluded: boolean) => {
      setExcluded(newExcluded);
      setHasChanges(true);
      const mediaUrls = media.map((m) => m.url);
      onContentChange({ content, mediaUrls, excluded: newExcluded });
    },
    [content, media, onContentChange]
  );

  const handleReset = useCallback(() => {
    setContent(globalContent);
    setMedia(globalMedia);
    setExcluded(false);
    setHasChanges(false);
    onReset();
  }, [globalContent, globalMedia, onReset]);

  const handleCopyFromGlobal = useCallback(() => {
    setContent(globalContent);
    setMedia(globalMedia);
    setHasChanges(true);
    const mediaUrls = globalMedia.map((m) => m.url);
    onContentChange({ content: globalContent, mediaUrls, excluded });
  }, [globalContent, globalMedia, excluded, onContentChange]);

  const characterCount = content.length;
  const characterLimit = config.characterLimit;
  const isOverLimit = characterCount > characterLimit;
  const mediaLimit = config.mediaLimit;
  const isMediaOverLimit = media.length > mediaLimit;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: PLATFORM_COLORS[platform],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {platform === "TWITTER" ? "X" : platform[0]}
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {PLATFORM_LABELS[platform]}
            </Typography>
            {isCustomized && (
              <Chip
                label="Customized"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isCustomized && (
            <Button
              size="small"
              startIcon={<RestartAlt />}
              onClick={handleReset}
              disabled={isSaving}
              sx={{ fontSize: "0.75rem" }}
            >
              Reset to Global
            </Button>
          )}
          {!isCustomized && (
            <Button
              size="small"
              startIcon={<ContentCopy />}
              onClick={handleCopyFromGlobal}
              disabled={isSaving}
              sx={{ fontSize: "0.75rem" }}
            >
              Copy from Global
            </Button>
          )}
        </Box>
      </Box>

      {/* Exclude Toggle */}
      <Paper
        sx={{
          p: 2,
          bgcolor: alpha(PLATFORM_COLORS[platform], 0.04),
          border: "1px solid",
          borderColor: alpha(PLATFORM_COLORS[platform], 0.12),
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={excluded}
              onChange={(e) => handleExcludedChange(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Exclude from {PLATFORM_LABELS[platform]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Don't publish this post to {PLATFORM_LABELS[platform]}
              </Typography>
            </Box>
          }
        />
      </Paper>

      {/* Media Section */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Media
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              color={isMediaOverLimit ? "error" : "text.secondary"}
            >
              {media.length} / {mediaLimit} {mediaLimit === 1 ? "item" : "items"}
            </Typography>
            {isMediaOverLimit && (
              <Chip
                label={`${media.length - mediaLimit} over limit`}
                size="small"
                color="error"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>
        <MediaCarousel
          media={media}
          onMediaChange={handleMediaChange}
          maxItems={mediaLimit}
        />
        {isMediaOverLimit && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            Only {mediaLimit} items will be published. Remove extra items or they'll be truncated.
          </Typography>
        )}
      </Box>

      {/* Caption Section */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Caption
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              color={isOverLimit ? "error" : "text.secondary"}
            >
              {characterCount} / {characterLimit}
            </Typography>
            {isOverLimit && (
              <Chip
                label={`${characterCount - characterLimit} over`}
                size="small"
                color="error"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </Box>
        <TextField
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={`Write your ${PLATFORM_LABELS[platform]} caption...`}
          multiline
          rows={6}
          fullWidth
          disabled={excluded}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "1rem",
            },
          }}
          error={isOverLimit}
          helperText={
            isOverLimit
              ? `Content exceeds ${PLATFORM_LABELS[platform]} character limit`
              : undefined
          }
        />
      </Box>

      {/* Platform-specific info */}
      <Paper
        sx={{
          p: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <strong>Tip:</strong> {PLATFORM_LABELS[platform]} posts work best with{" "}
          {platform === "TWITTER"
            ? "short, engaging text (280 characters). Consider using threads for longer content."
            : platform === "INSTAGRAM"
            ? "casual, engaging captions with relevant hashtags."
            : platform === "LINKEDIN"
            ? "professional, informative content with industry insights."
            : "community-focused updates and news."}
        </Typography>
      </Paper>
    </Box>
  );
}
