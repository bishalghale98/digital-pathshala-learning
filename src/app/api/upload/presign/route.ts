import { NextRequest } from "next/server";
import { authMiddleware } from "../../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";
import { errorResponse, successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import {
  validateFileType,
  validateFileSize,
  generateObjectKey,
  getPresignedUploadUrl,
} from "@/lib/storage/r2";
import { z } from "zod";

const presignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().positive(),
  context: z.enum(["course", "article", "avatar", "editor"]).default("course"),
  entityId: z.string().min(1).optional(),
});

export const POST = tryCatch(async (req: NextRequest) => {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);
  if (checkAuth.status !== 200) {
    return checkAuth;
  }

  const body = await req.json();
  const parsed = presignSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid upload request", 400);
  }

  const { fileName, contentType, fileSize, context, entityId } = parsed.data;
  void fileName;

  const ext = validateFileType(contentType);
  if (!ext) {
    return errorResponse(
      "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF",
      400
    );
  }

  if (!validateFileSize(fileSize, context)) {
    const maxMB =
      context === "avatar"
        ? "2 MB"
        : "5 MB";
    return errorResponse(`File too large. Maximum size: ${maxMB}`, 400);
  }

  const folderMap: Record<string, string> = {
    course: "courses",
    article: "articles",
    avatar: "avatars",
    editor: "editor",
  };

  const id = entityId ?? "general";
  const key = generateObjectKey(folderMap[context], id, contentType);

  const uploadUrl = await getPresignedUploadUrl(key, contentType);

  return successResponse("Presigned URL generated", {
    uploadUrl,
    key,
    contentType,
    expiresIn: 300,
  });
});
