import { describe, expect, it } from "vitest";
import {
  ADMIN_SECTION_PERMISSIONS,
  hasPermission,
  isAdminRole,
  type Permission,
} from "@/lib/auth/permissions";

const allPermissions: Permission[] = [
  "products:read",
  "products:write",
  "orders:read",
  "orders:write",
  "services:read",
  "services:write",
  "content:write",
  "users:manage",
  "settings:write",
];

describe("isAdminRole", () => {
  it("recognizes every staff role", () => {
    for (const role of [
      "SUPER_ADMIN",
      "ADMIN",
      "PRODUCT_MANAGER",
      "ORDER_MANAGER",
      "CONTENT_MANAGER",
      "SERVICE_MANAGER",
    ]) {
      expect(isAdminRole(role)).toBe(true);
    }
  });

  it("rejects customers, unknown roles and missing values", () => {
    expect(isAdminRole("CUSTOMER")).toBe(false);
    expect(isAdminRole("HACKER")).toBe(false);
    expect(isAdminRole("")).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});

describe("hasPermission", () => {
  it("grants every permission to SUPER_ADMIN", () => {
    for (const permission of allPermissions) {
      expect(hasPermission("SUPER_ADMIN", permission)).toBe(true);
    }
  });

  it("grants no permission to customers or unknown roles", () => {
    for (const permission of allPermissions) {
      expect(hasPermission("CUSTOMER", permission)).toBe(false);
      expect(hasPermission("UNKNOWN", permission)).toBe(false);
    }
    expect(hasPermission(undefined, "orders:read")).toBe(false);
    expect(hasPermission(null, "orders:read")).toBe(false);
  });

  it("scopes each manager role to its own section", () => {
    expect(hasPermission("PRODUCT_MANAGER", "products:write")).toBe(true);
    expect(hasPermission("PRODUCT_MANAGER", "orders:read")).toBe(false);

    expect(hasPermission("ORDER_MANAGER", "orders:write")).toBe(true);
    expect(hasPermission("ORDER_MANAGER", "products:read")).toBe(false);

    expect(hasPermission("CONTENT_MANAGER", "content:write")).toBe(true);
    expect(hasPermission("CONTENT_MANAGER", "users:manage")).toBe(false);

    expect(hasPermission("SERVICE_MANAGER", "services:write")).toBe(true);
    expect(hasPermission("SERVICE_MANAGER", "content:write")).toBe(false);
  });

  it("does not let ADMIN manage users or settings", () => {
    expect(hasPermission("ADMIN", "orders:write")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(false);
    expect(hasPermission("ADMIN", "settings:write")).toBe(false);
  });
});

describe("ADMIN_SECTION_PERMISSIONS", () => {
  it("maps sections to the expected permissions", () => {
    expect(ADMIN_SECTION_PERMISSIONS.dashboard).toBeNull();
    expect(ADMIN_SECTION_PERMISSIONS.products).toBe("products:read");
    expect(ADMIN_SECTION_PERMISSIONS.orders).toBe("orders:read");
    expect(ADMIN_SECTION_PERMISSIONS.services).toBe("services:read");
    expect(ADMIN_SECTION_PERMISSIONS.users).toBe("users:manage");
  });
});
