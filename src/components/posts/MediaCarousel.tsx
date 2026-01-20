"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Image as ImageIcon,
  Film,
  GripVertical,
} from "lucide-react";

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  alt?: string;
  file?: File;
}

interface MediaCarouselProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  maxItems?: number;
  className?: string;
}

export function MediaCarousel({
  media,
  onMediaChange,
  maxItems = 10,
  className,
}: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const newMedia: MediaItem[] = files
        .slice(0, maxItems - media.length)
        .map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : "image",
          alt: file.name,
          file,
        }));

      onMediaChange([...media, ...newMedia]);
      if (e.target) e.target.value = "";
    },
    [media, maxItems, onMediaChange]
  );

  const removeMedia = useCallback(
    (index: number) => {
      const newMedia = media.filter((_, i) => i !== index);
      onMediaChange(newMedia);
      if (activeIndex >= newMedia.length && newMedia.length > 0) {
        setActiveIndex(newMedia.length - 1);
      }
    },
    [media, activeIndex, onMediaChange]
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMedia = [...media];
    const [removed] = newMedia.splice(draggedIndex, 1);
    newMedia.splice(index, 0, removed);
    onMediaChange(newMedia);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Preview Area */}
      <div className="relative aspect-[4/3] w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
        {media.length > 0 ? (
          <>
            {/* Current Media */}
            <div className="absolute inset-0">
              {media[activeIndex]?.type === "video" ? (
                <video
                  src={media[activeIndex].url}
                  className="h-full w-full object-contain bg-black"
                  controls
                />
              ) : (
                <img
                  src={media[activeIndex]?.url}
                  alt={media[activeIndex]?.alt || "Media preview"}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Navigation Arrows */}
            {media.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {media.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {media.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === activeIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={() => removeMedia(activeIndex)}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Media Counter */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-sm font-medium">
              {activeIndex + 1} / {media.length}
            </div>
          </>
        ) : (
          /* Empty State */
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">Add photos or videos</p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to upload
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {media.length > 0 && (
        <div className="flex gap-2 items-center">
          {/* Thumbnails */}
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
            {media.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all group",
                  index === activeIndex
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-transparent hover:border-gray-300",
                  draggedIndex === index && "opacity-50"
                )}
              >
                {item.type === "video" ? (
                  <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                    <Film className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt || "Thumbnail"}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                </div>
              </div>
            ))}

            {/* Add More Button */}
            {media.length < maxItems && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-6 w-6 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Platform Hints */}
      {media.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            Twitter: Up to 4 images or 1 video
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            Instagram: Up to 10 items
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            LinkedIn: Up to 9 images
          </span>
        </div>
      )}
    </div>
  );
}
