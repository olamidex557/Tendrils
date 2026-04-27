"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function uploadStoreMedia(formData: FormData) {
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") || "uploads");

  if (!file) {
    throw new Error("No file selected.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  const maxSize = 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Image must be less than 5MB.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from("store-media")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage
    .from("store-media")
    .getPublicUrl(fileName);

  return {
    url: data.publicUrl,
    path: fileName,
  };
}
