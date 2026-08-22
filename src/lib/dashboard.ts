import { Roles } from "./constants";

/**
 * Single source of truth for role → dashboard URL.
 */
export const getDashboardPath = (role?: string | null): string => {
  if (role === Roles.Admin) return "/admin";
  return "/student";
};
