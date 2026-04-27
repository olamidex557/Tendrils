"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadStoreMedia } from "@/lib/actions/upload-media";
import imageCompression from "browser-image-compression";

type Props = {
  label: string;
  value: string;
  folder: "products" | "categories" | "banners";
  onChange: (url: string) => void;
};

export default function ImageUploadField({
  label,
  value,
  folder,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");

    startTransition(async () => {
      try {
        // compress image before upload
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp",
        });

        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("folder", folder);

        const result = await uploadStoreMedia(formData);

        onChange(result.url);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Upload failed.");
      }
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-black">{label}</p>

      <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-4">
        {value ? (
          <div className="relative overflow-hidden rounded-2xl bg-white">
            <Image
              src={value}
              alt={label}
              width={800}
              height={500}
              sizes="(max-width: 768px) 100vw, 800px"
              className="h-56 w-full object-cover"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-3 top-3 rounded-full bg-white"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl bg-white text-center"
          >
            {isPending ? (
              <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
            ) : (
              <ImagePlus className="h-8 w-8 text-stone-500" />
            )}

            <p className="mt-3 text-sm font-medium text-black">
              {isPending ? "Uploading..." : "Upload image"}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              PNG, JPG, WEBP up to 5MB
            </p>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {value ? (
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full rounded-full"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Replace Image"}
          </Button>
        ) : null}

        {message ? (
          <p className="mt-3 text-sm text-red-600">{message}</p>
        ) : null}
      </div>
    </div>
  );
}
