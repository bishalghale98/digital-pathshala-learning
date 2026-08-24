import prisma from "@/database/prisma";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        categories: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return successResponse("Courses fetched successfully", courses, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch courses", 500);
  }
}
