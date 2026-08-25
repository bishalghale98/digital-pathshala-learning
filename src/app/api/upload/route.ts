import { NextRequest } from "next/server";
import { authMiddleware } from "../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import {
  validateFileType,
  validateFileSize,
  generateObjectKey,
  uploadToR2,
} from "@/lib/storage/r2";

const CONTEXT_MAP: Record<string, string> = {
  course: "courses",
  article: "articles",
  avatar: "avatars",
  editor: "editor",
};

export const POST = tryCatch(async (req: NextRequest) => {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);
  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const context = (formData.get("context") as string) || "course";
  const entityId = (formData.get("entityId") as string) || "general";

  if (!file) {
    return errorResponse("No file provided", 400);
  }

  const ext = validateFileType(file.type);
  if (!ext) {
    return errorResponse(
      "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF",
      400
    );
  }

  if (!validateFileSize(file.size, context)) {
    const maxMB = context === "avatar" ? "2 MB" : "5 MB";
    return errorResponse(`File too large. Maximum size: ${maxMB}`, 400);
  }

  const key = generateObjectKey(CONTEXT_MAP[context] ?? "uploads", entityId, file.type);
  const buffer = Buffer.from(await file.arrayBuffer());

  await uploadToR2(key, buffer, file.type);

  return successResponse("File uploaded", { key });
});
