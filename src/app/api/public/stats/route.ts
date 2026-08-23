import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import Category from "@/database/models/category.schema";
import "@/database/models/category.schema";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    await dbConnect();
    const [courseCount, categoryCount] = await Promise.all([
      Course.countDocuments(),
      Category.countDocuments(),
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
