import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const UPLOAD_ROOT = "CLAT_NOIDA";

export async function uploadImage(file: File, folder: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `${UPLOAD_ROOT}/${folder}`, resource_type: "image", use_filename: true, unique_filename: true },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Upload failed"));
          else resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(buffer);
  });
}
