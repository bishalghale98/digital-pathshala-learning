import { Roles } from "./constants";
import { ROUTES } from "./constants";

/**
 * Single source of truth for role → dashboard URL.
 */
export const getDashboardPath = (role?: string | null): string => {
  if (role === Roles.Admin) return ROUTES.ADMIN_DASHBOARD;
  if (role === Roles.Instructor) return ROUTES.INSTRUCTOR_DASHBOARD;
  return ROUTES.STUDENT_DASHBOARD;
};
