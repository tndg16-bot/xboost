import React, { useState, useRef, DragEvent } from 'react';

export interface MediaAttachmentProps {
  mediaUrls: string[];
  onMediaChange: (urls: string[]) => void;
}

type MediaType = 'image' | 'video';

interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  isLoading: boolean;
  error: string | null;
}

export function MediaAttachment({ mediaUrls, onMediaChange }: MediaAttachmentProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'image'; // fallback
  };

  const isSupportedFormat = (file: File): boolean => {
    const imageFormats = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    const videoFormats = ['video/mp4', 'video/quicktime', 'video/webm'];
    return [...imageFormats, ...videoFormats].includes(file.type);
  };

  const processFile = (file: File): MediaItem => {
    return {
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      type: getMediaType(file),
      isLoading: false,
      error: null,
    };
  };

  const handleFileSelect = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(isSupportedFormat);

    if (validFiles.length === 0) return;

    const newMediaItems = validFiles.map(processFile);
    setMediaItems((prev) => [...prev, ...newMediaItems]);
    onMediaChange([...mediaUrls, ...newMediaItems.map((item) => item.url)]);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];

    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && isSupportedFormat(file)) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeMedia = (id: string) => {
    const itemToRemove = mediaItems.find((item) => item.id === id);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.url);
    }

    const updatedItems = mediaItems.filter((item) => item.id !== id);
    setMediaItems(updatedItems);
    onMediaChange(updatedItems.map((item) => item.url));
  };

  return (
    <div
      className="mb-4"
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Copy/Paste Hint */}
      <div className="mb-2 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
        <span>💡</span>
        <span>画像・動画はコピペできます</span>
        <span className="rounded bg-white px-1.5 py-0.5 text-xs text-zinc-700">
          Ctrl+V / Cmd+V
        </span>
      </div>

      {/* Media Grid */}
      {mediaItems.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg border-2 border-zinc-200 bg-zinc-100"
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Media ${item.id}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="h-full w-full object-cover"
                />
              )}
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
                aria-label="Remove media"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-100"
        type="button"
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>画像・動画を追加</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />
    </div>
  );
}
