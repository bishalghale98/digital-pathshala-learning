import { getPublicUrl, isR2Key } from "@/lib/storage/r2";

export function resolveImageUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (isR2Key(value)) {
    return getPublicUrl(value);
  }
  return value;
}
