"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import "@/styles/social-previews.css";
import {
  TwitterPostPreview,
  LinkedInPostPreview,
  FacebookPostPreview,
  InstagramPostPreview,
} from "@automattic/social-previews";
import type { MediaItem } from "./MediaCarousel";
import { cn } from "@/lib/utils";
import { Platform } from "@/types";
import { getPlatformConfig } from "@/lib/social/platform-config";

interface SocialPreviewsProps {
  platform: Platform;
  content: string;
  media: MediaItem[];
  userName?: string;
  userHandle?: string;
  userImage?: string;
  className?: string;
}

export function SocialPreview({
  platform,
  content,
  media,
  userName = "Your Name",
  userHandle = "yourhandle",
  userImage = "",
  className,
}: SocialPreviewsProps) {
  const config = getPlatformConfig(platform);
  const mediaLimit = config.mediaLimit;
  const isOverLimit = content.length > config.characterLimit;
  const hasMedia = media.length > 0;

  const formattedMedia = useMemo(() => {
    return media.slice(0, mediaLimit).map((item) => ({
      url: item.url,
      alt: item.alt || "",
      type: item.type === "video" ? "video/mp4" : "image/jpeg",
    }));
  }, [media, mediaLimit]);

  const firstImage = formattedMedia[0]?.url;

  const profileImage =
    userImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&size=200`;

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={platform} />
          <span className="font-medium text-sm text-gray-700">
            {platform === "TWITTER" ? "X (Twitter)" : platform.charAt(0) + platform.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn(isOverLimit ? "text-red-500 font-medium" : "text-gray-500")}>
            {content.length} / {config.characterLimit}
          </span>
          {isOverLimit && (
            <span className="text-red-500">({content.length - config.characterLimit} over)</span>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {platform === "TWITTER" && (
          <div className="social-preview-twitter">
            <TwitterPostPreview
              name={userName}
              screenName={userHandle}
              profileImage={profileImage}
              text={content || "What's happening?"}
              date={new Date()}
              media={formattedMedia}
            />
          </div>
        )}

        {platform === "LINKEDIN" && (
          <div className="social-preview-linkedin">
            <LinkedInPostPreview
              name={userName}
              profileImage={profileImage}
              jobTitle="Professional"
              title=""
              description={content || "Share your thoughts..."}
              url=""
              image={firstImage}
              media={formattedMedia}
            />
          </div>
        )}

        {platform === "FACEBOOK" && (
          <div className="social-preview-facebook">
            <FacebookPostPreview
              user={{
                displayName: userName,
                avatarUrl: profileImage,
              }}
              title=""
              description={content || "What's on your mind?"}
              url=""
              image={firstImage}
              media={formattedMedia}
            />
          </div>
        )}

        {platform === "INSTAGRAM" && (
          <div className="social-preview-instagram">
            {hasMedia ? (
              <InstagramCarousel
                name={userName}
                profileImage={profileImage}
                caption={content}
                media={formattedMedia}
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-3">
                  <InstagramIcon className="h-12 w-12 mx-auto text-gray-300" />
                </div>
                <p className="font-medium">Add media to preview</p>
                <p className="text-sm mt-1">Instagram posts require at least one image or video</p>
              </div>
            )}
          </div>
        )}
      </div>

      {platform === "INSTAGRAM" && !hasMedia && (
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ Instagram requires at least one image or video to post
        </div>
      )}

      {media.length > mediaLimit && (
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          ⚠️ {platform === "TWITTER" ? "X" : platform.charAt(0) + platform.slice(1).toLowerCase()} supports up to {mediaLimit} {mediaLimit === 1 ? "item" : "items"}. Extra media will not be included.
        </div>
      )}

      {isOverLimit && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
          ⚠️ Content exceeds {platform === "TWITTER" ? "X" : platform.charAt(0) + platform.slice(1).toLowerCase()}'s character limit by {content.length - config.characterLimit} characters
        </div>
      )}
    </div>
  );
}

interface InstagramCarouselProps {
  name: string;
  profileImage: string;
  caption: string;
  media: Array<{ url: string; alt: string; type: string }>;
}

function InstagramCarousel({ name, profileImage, caption, media }: InstagramCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const hasMultiple = media.length > 1;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!hasMultiple) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [hasMultiple, goToNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0]?.clientX ?? null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, goToNext, goToPrev]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    },
    [goToPrev, goToNext]
  );

  useEffect(() => {
    if (!hasMultiple) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultiple, handleKeyDown]);

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {media.map((item, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {item.type.includes("video") ? (
              <video src={item.url} className="w-full h-full object-cover" controls />
            ) : (
              <img
                src={item.url}
                alt={item.alt || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}

        {hasMultiple && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-white w-3"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-black/50 rounded-full text-white text-xs font-medium">
              {currentIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={profileImage}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">{name}</span>
        </div>
        <p className="text-sm text-gray-800">
          <span className="font-semibold mr-2">{name}</span>
          {caption}
        </p>
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "TWITTER":
      return <XTwitterIcon className="h-5 w-5" />;
    case "LINKEDIN":
      return <LinkedInIcon className="h-5 w-5 text-[#0A66C2]" />;
    case "FACEBOOK":
      return <FacebookIcon className="h-5 w-5 text-[#1877F2]" />;
    case "INSTAGRAM":
      return <InstagramIcon className="h-5 w-5 text-[#E4405F]" />;
    default:
      return null;
  }
}

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}
