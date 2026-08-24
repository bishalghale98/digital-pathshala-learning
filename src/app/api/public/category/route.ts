import prisma from "@/database/prisma";
import { successResponse, errorResponse } from "@/utils/response";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    return successResponse("Categories fetched successfully", categories, 200);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch categories", 500);
  }
}
