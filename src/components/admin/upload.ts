"use client";

import { adminApi } from "./api";

/** Uploads an image to Cloudinary through the admin API and returns its URL. */
export async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be under 8 MB");
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const { url } = await adminApi<{ url: string }>("/api/admin/upload", { method: "POST", body });
  return url;
}
