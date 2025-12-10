export const Roles = {
  Admin: "admin",
  Student: "student",
} as const;

export type RoleType = (typeof Roles)[keyof typeof Roles];

export const validateRole = (value: string): RoleType => {
  if (!Object.values(Roles).includes(value as RoleType)) {
    throw new Error(`Invalid role: ${value}`);
  }
  return value as RoleType;
};
