/**
 * Generate a URL-safe slug from a string.
 *
 * Examples:
 *   "Web Development"       → "web-development"
 *   "UI/UX Design"          → "ui-ux-design"
 *   "Data Science & AI"     → "data-science-ai"
 *   "  Hello   World  "     → "hello-world"
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
