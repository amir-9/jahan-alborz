import type { UserRole } from "@/lib/generated/prisma/enums";

export type Permission =
  | "products:read"
  | "products:write"
  | "orders:read"
  | "orders:write"
  | "services:read"
  | "services:write"
  | "content:write"
  | "users:manage"
  | "settings:write";

const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "PRODUCT_MANAGER",
  "ORDER_MANAGER",
  "CONTENT_MANAGER",
  "SERVICE_MANAGER",
];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [],
  SUPER_ADMIN: [
    "products:read",
    "products:write",
    "orders:read",
    "orders:write",
    "services:read",
    "services:write",
    "content:write",
    "users:manage",
    "settings:write",
  ],
  ADMIN: [
    "products:read",
    "products:write",
    "orders:read",
    "orders:write",
    "services:read",
    "services:write",
    "content:write",
  ],
  PRODUCT_MANAGER: ["products:read", "products:write"],
  ORDER_MANAGER: ["orders:read", "orders:write"],
  CONTENT_MANAGER: ["content:write"],
  SERVICE_MANAGER: ["services:read", "services:write"],
};

export function isAdminRole(role: string | undefined | null): boolean {
  return Boolean(role && ADMIN_ROLES.includes(role as UserRole));
}

export function hasPermission(
  role: string | undefined | null,
  permission: Permission,
): boolean {
  if (!role) {
    return false;
  }

  return ROLE_PERMISSIONS[role as UserRole]?.includes(permission) ?? false;
}

/** Permission required to enter each admin section. */
export const ADMIN_SECTION_PERMISSIONS = {
  dashboard: null,
  products: "products:read",
  orders: "orders:read",
  services: "services:read",
  users: "users:manage",
} as const satisfies Record<string, Permission | null>;
