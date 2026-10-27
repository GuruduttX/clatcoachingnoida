import { requireAdmin } from "@/lib/server/auth";
import { uploadImage } from "@/lib/server/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "misc").replace(/[^a-z0-9-]/gi, "") || "misc";

  if (!(file instanceof File)) return Response.json({ error: "No file received" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "Only images can be uploaded" }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Images must be under 8 MB" }, { status: 400 });

  try {
    return Response.json(await uploadImage(file, folder));
  } catch (error) {
    console.error("[upload] Cloudinary upload failed:", error);
    return Response.json({ error: "Upload failed. Try again." }, { status: 502 });
  }
}
