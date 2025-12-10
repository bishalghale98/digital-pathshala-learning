export type UserWithRole = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: RoleType;
};

export const Roles = {
  Admin: "admin",
  Student: "student",
} as const;

export type RoleType = (typeof Roles)[keyof typeof Roles]; // "admin" | "student"

// Reusable role validator
export const validateRole = (value: string): RoleType => {
  if (!Object.values(Roles).includes(value as RoleType)) {
    throw new Error(`Invalid role: ${value}`);
  }
  return value as RoleType;
};
