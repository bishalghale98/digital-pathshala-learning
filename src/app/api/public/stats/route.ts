import prisma from "@/database/prisma";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    const [courseCount, categoryCount] = await Promise.all([
      prisma.course.count(),
      prisma.category.count(),
    ]);
    return successResponse(
      "Stats fetched successfully",
      { courses: courseCount, categories: categoryCount },
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch stats", 500);
  }
}
