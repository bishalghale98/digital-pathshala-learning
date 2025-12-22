import { db } from "@/lib/auth";
import { Roles } from "@/lib/constants";
import { successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getStudents = tryCatch(async (req: NextRequest) => {
  const students = await db
    .collection("user")
    .find({ role: Roles.Student })
    .sort({ createdAt: -1 })
    .toArray();

  return successResponse("Student fetch successfully", students);
});
