import dbConnect from "@/database/dbConnection";
import Category from "@/database/models/category.schema";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    const mainCategories = categories.filter(
      (cat) => !cat.parent
    );

    const tree = mainCategories.map((main) => ({
      ...main,
      subcategories: categories.filter(
        (sub) => sub.parent?.toString() === main._id.toString()
      ),
    }));

    return successResponse("Categories fetched successfully", tree, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch categories", 500);
  }
}
