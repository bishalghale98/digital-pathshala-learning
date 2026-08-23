import dbConnect from "@/database/dbConnection";
import Course from "@/database/models/course.schema";
import { successResponse, errorResponse } from "@/utils/response";
import "@/database/models/category.schema";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({ status: "published" })
      .populate("categoryId")
      .populate("subcategoryId")
      .sort({ createdAt: -1 })
      .lean();
    return successResponse("Courses fetched successfully", courses, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch courses", 500);
  }
}
