'use client';

import { useState, useCallback, useEffect } from 'react';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  name: string;
  size: number;
}

interface ImagePasteUploaderProps {
  onFilesChange?: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxImageSize?: number; // MB
  maxVideoSize?: number; // MB
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

export function ImagePasteUploader({
  onFilesChange,
  maxFiles = 4,
  maxImageSize = 5, // 5MB
  maxVideoSize = 100, // 100MB
}: ImagePasteUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // ファイルタイプチェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `対応していないファイル形式です: ${file.type}. JPG, PNG, GIF, MP4, MOVのみ対応`,
      };
    }

    // ファイルサイズチェック
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const maxSize = isImage ? maxImageSize : maxVideoSize;
    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB > maxSize) {
      return {
        valid: false,
        error: `ファイルサイズが大きすぎます: ${sizeInMB.toFixed(1)}MB. ${isImage ? '画像' : '動画'}は${maxSize}MB以下にしてください`,
      };
    }

    return { valid: true };
  };

  const createMediaFile = (file: File): MediaFile => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    return {
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: isImage ? 'image' : 'video',
      name: file.name,
      size: file.size,
    };
  };

  const addFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      setError(null);

      const fileArray = Array.from(newFiles);

      // 最大ファイル数チェック
      if (files.length + fileArray.length > maxFiles) {
        setError(`最大${maxFiles}個までしか添付できません`);
        return;
      }

      const validFiles: MediaFile[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error ?? 'ファイルの検証に失敗しました');
          continue;
        }
        validFiles.push(createMediaFile(file));
      }

      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, maxFiles, onFilesChange, maxImageSize, maxVideoSize]
  );

  const removeFile = useCallback(
    (id: string) => {
      const updatedFiles = files.filter((f) => f.id !== id);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, onFilesChange]
  );

  // クリップボード貼り付け
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter((item) =>
        ALLOWED_TYPES.includes(item.type)
      );

      if (imageItems.length > 0) {
        e.preventDefault();
        const files: File[] = [];

        imageItems.forEach((item) => {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        });

        if (files.length > 0) {
          const dataTransfer = new DataTransfer();
          files.forEach((file) => dataTransfer.items.add(file));
          addFiles(dataTransfer.files);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addFiles]);

  // ドラッグ&ドロップ
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  // ファイル入力
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.target.value = ''; // 同じファイルを再度選択できるように
    },
    [addFiles]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* ドラッグ&ドロップエリア */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileInput}
          disabled={files.length >= maxFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-2">
          <div className="text-4xl">📎</div>
          <p className="text-gray-600 font-medium">
            クリックしてファイルを選択
            <br />
            またはドラッグ&ドロップ
          </p>
          <p className="text-sm text-gray-400">
            画像: JPG, PNG, GIF (最大{maxImageSize}MB)
            <br />
            動画: MP4, MOV (最大{maxVideoSize}MB)
          </p>
          <p className="text-sm text-blue-600">
            💡 画像をコピーして貼り付けることもできます
          </p>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ファイル一覧 */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
            >
              {/* プレビュー */}
              <div className="aspect-square relative">
                {file.type === 'image' ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎬</div>
                      <p className="text-xs text-gray-500 px-2 truncate">
                        {file.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* 削除ボタン */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>

                {/* ファイルタイプバッジ */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                  {file.type === 'image' ? '🖼️' : '🎬'} {formatSize(file.size)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ファイル数インジケータ */}
      <div className="mt-2 text-sm text-gray-500 text-right">
        {files.length} / {maxFiles} 個
      </div>
    </div>
  );
}

export type { MediaFile };
