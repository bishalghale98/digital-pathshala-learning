import prisma from "@/database/prisma";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        children: true,
      },
    });

    const mainCategories = categories.filter((cat) => !cat.parentId);

    const tree = mainCategories.map((main) => ({
      ...main,
      subcategories: main.children,
    }));

    return successResponse("Categories fetched successfully", tree, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch categories", 500);
  }
}
