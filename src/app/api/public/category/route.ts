import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    return successResponse("Categories fetched successfully", categories, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch categories", 500);
  }
}
