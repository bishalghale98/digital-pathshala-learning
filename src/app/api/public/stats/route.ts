import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import Category from "@/database/models/category.schema";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    await dbConnect();
    const [courseCount, categoryCount] = await Promise.all([
      Course.countDocuments({ status: "published" }),
      Category.countDocuments({ isActive: true }),
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
