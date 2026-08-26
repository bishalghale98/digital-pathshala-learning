import { getCategories } from "@/server/modules/categories/category.controller";

export async function GET() {
  return getCategories();
}
