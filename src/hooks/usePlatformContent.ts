"use client";

import { useState, useCallback, useEffect } from "react";
import { Platform, PlatformContent } from "@/types";
import { mergePostWithPlatformContent } from "@/types";

interface UsePlatformContentOptions {
  postId: string;
  initialContent: string;
  initialMediaUrls: string[];
  onError?: (error: Error) => void;
}

interface UsePlatformContentReturn {
  platformContents: PlatformContent[];
  isLoading: boolean;
  isSaving: boolean;
  getPlatformContent: (platform: Platform) => { content: string; mediaUrls: string[] };
  updatePlatformContent: (platform: Platform, data: Partial<PlatformContent>) => Promise<void>;
  resetPlatformContent: (platform: Platform) => Promise<void>;
  deletePlatformContent: (platform: Platform) => Promise<void>;
  isPlatformCustomized: (platform: Platform) => boolean;
  getAllPlatformContents: () => PlatformContent[];
  saveAllPlatformContents: (contents: Array<{ platform: Platform; content?: string; mediaUrls?: string[]; excluded?: boolean }>) => Promise<void>;
}

export function usePlatformContent({
  postId,
  initialContent,
  initialMediaUrls,
  onError,
}: UsePlatformContentOptions): UsePlatformContentReturn {
  const [platformContents, setPlatformContents] = useState<PlatformContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPlatformContents();
  }, [postId]);

  const fetchPlatformContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/platform-contents`);
      if (!response.ok) throw new Error("Failed to fetch platform contents");
      const data = await response.json();
      setPlatformContents(data);
    } catch (error) {
      console.error("Error fetching platform contents:", error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlatformContent = useCallback(
    async (platform: Platform, data: Partial<PlatformContent>) => {
      try {
        setIsSaving(true);
        const response = await fetch(`/api/posts/${postId}/platform-contents`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            content: data.content,
            mediaUrls: data.mediaUrls ? JSON.stringify(data.mediaUrls) : undefined,
            excluded: data.excluded,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update platform content");
        }

        const updatedContent = await response.json();

        setPlatformContents((prev) => {
          const index = prev.findIndex((pc) => pc.platform === platform);
          if (index >= 0) {
            const newContents = [...prev];
            newContents[index] = updatedContent;
            return newContents;
          }
          return [...prev, updatedContent];
        });
      } catch (error) {
        console.error("Error updating platform content:", error);
        onError?.(error as Error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [postId, onError]
  );

  const resetPlatformContent = useCallback(
    async (platform: Platform) => {
      try {
        setIsSaving(true);
        const response = await fetch(
          `/api/posts/${postId}/platform-contents?platform=${platform}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error("Failed to reset platform content");
        }

        setPlatformContents((prev) =>
          prev.filter((pc) => pc.platform !== platform)
        );
      } catch (error) {
        console.error("Error resetting platform content:", error);
        onError?.(error as Error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [postId, onError]
  );

  const deletePlatformContent = useCallback(
    async (platform: Platform) => {
      return resetPlatformContent(platform);
    },
    [resetPlatformContent]
  );

  const isPlatformCustomized = useCallback(
    (platform: Platform) => {
      return platformContents.some((pc) => pc.platform === platform);
    },
    [platformContents]
  );

  const getPlatformContent = useCallback(
    (platform: Platform) => {
      return mergePostWithPlatformContent(
        { content: initialContent, mediaUrls: initialMediaUrls },
        platformContents,
        platform
      );
    },
    [initialContent, initialMediaUrls, platformContents]
  );

  const getAllPlatformContents = useCallback(() => {
    return platformContents;
  }, [platformContents]);

  const saveAllPlatformContents = useCallback(
    async (
      contents: Array<{
        platform: Platform;
        content?: string;
        mediaUrls?: string[];
        excluded?: boolean;
      }>
    ) => {
      try {
        setIsSaving(true);
        await Promise.all(
          contents.map((item) =>
            updatePlatformContent(item.platform, {
              content: item.content,
              mediaUrls: item.mediaUrls ? JSON.stringify(item.mediaUrls) as any : undefined,
              excluded: item.excluded,
            })
          )
        );
      } finally {
        setIsSaving(false);
      }
    },
    [updatePlatformContent]
  );

  return {
    platformContents,
    isLoading,
    isSaving,
    getPlatformContent,
    updatePlatformContent,
    resetPlatformContent,
    deletePlatformContent,
    isPlatformCustomized,
    getAllPlatformContents,
    saveAllPlatformContents,
  };
}
