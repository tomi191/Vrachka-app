"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { processImage, validateImageFile } from "@/lib/utils/image";
import Image from "next/image";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName: string;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  userName,
  onUploadSuccess,
  onRemove,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);

      // Process image (resize + convert to WebP)
      const { file: processedFile, dataUrl } = await processImage(file);

      // Show preview
      setPreview(dataUrl);

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", processedFile);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Грешка при качване");
      }

      // Success
      onUploadSuccess(data.url);
      setPreview(data.url);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError(err instanceof Error ? err.message : "Грешка при качване");
      setPreview(currentAvatarUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;

    try {
      setUploading(true);

      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Грешка при премахване");
      }

      setPreview(null);
      onRemove();
    } catch (err) {
      console.error("Avatar remove error:", err);
      setError(err instanceof Error ? err.message : "Грешка при премахване");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar Preview */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          {preview ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-accent-500/30">
              <Image
                src={preview}
                alt={userName}
                fill
                sizes="96px"
                className="object-cover"
              />
              {!uploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-3xl font-bold ring-2 ring-accent-500/30">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-zinc-100 mb-1">
            Профилна снимка
          </h3>
          <p className="text-xs text-zinc-400 mb-3">
            JPG, PNG или WebP. Максимум 2MB.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 text-sm bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {preview ? "Смени" : "Качи снимка"}
            </button>
            {preview && onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="px-3 py-1.5 text-sm border border-red-600/50 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Премахни
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Drag & Drop Zone (alternative) */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-accent-500 bg-accent-950/20"
            : "border-zinc-700 hover:border-zinc-600"
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Upload className={`w-8 h-8 ${dragActive ? "text-accent-400" : "text-zinc-500"}`} />
          <p className="text-sm text-zinc-400">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-accent-400 hover:text-accent-300 underline"
            >
              Избери файл
            </button>{" "}
            или го пусни тук
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg flex items-start gap-2">
          <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}
