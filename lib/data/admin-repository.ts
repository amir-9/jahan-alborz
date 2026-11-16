import "server-only";

import type { Prisma } from "@/lib/generated/prisma/client";
import type {
  OrderStatus,
  ServiceRequestStatus,
  UserRole,
} from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";

/**
 * Administrator reads. Every caller must have passed requireAdminPage() or
 * getAdminActionUser() first; this module does not perform authorization.
 */

const PAGE_SIZE = 20;

export type AdminListFilters = {
  search?: string;
  status?: string;
  categoryId?: string;
  role?: string;
  page?: number;
};

function normalizeSearch(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function getAdminDashboard() {
  const prisma = getPrisma();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const [
    totalOrders,
    revenue,
    pendingOrders,
    pendingServices,
    totalProducts,
    lowStockCount,
    recentOrders,
    recentServices,
    paidOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", status: { not: "CANCELLED" } },
    }),
    prisma.order.count({
      where: { status: { in: ["PENDING", "AWAITING_PAYMENT", "CONFIRMED"] } },
    }),
    prisma.serviceRequest.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "ASSIGNED"] } },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, inventory: { lte: 3 } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
        createdAt: { gte: sixMonthsAgo },
      },
      select: { total: true, createdAt: true },
    }),
  ]);

  const monthFormatter = new Intl.DateTimeFormat("fa-IR", {
    month: "short",
  });

  const buckets: { key: string; label: string; total: number }[] = [];

  for (let index = 0; index < 6; index += 1) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(sixMonthsAgo.getMonth() + index);

    buckets.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: monthFormatter.format(date),
      total: 0,
    });
  }

  for (const order of paidOrders) {
    const key = `${order.createdAt.getFullYear()}-${String(
      order.createdAt.getMonth() + 1,
    ).padStart(2, "0")}`;
    const bucket = buckets.find((entry) => entry.key === key);

    if (bucket) {
      bucket.total += Number(order.total);
    }
  }

  const maxMonthly = Math.max(1, ...buckets.map((bucket) => bucket.total));

  return {
    totalOrders,
    totalRevenue: Number(revenue._sum.total ?? 0),
    pendingOrders,
    pendingServices,
    totalProducts,
    lowStockCount,
    recentOrders,
    recentServices,
    salesByMonth: buckets.map((bucket) => ({
      label: bucket.label,
      total: bucket.total,
      ratio: bucket.total / maxMonthly,
    })),
    paidOrderCount: paidOrders.length,
  };
}

function buildOrderWhere(filters: AdminListFilters): Prisma.OrderWhereInput {
  const search = normalizeSearch(filters.search);
  const status = filters.status?.trim();

  return {
    ...(status && status !== "ALL" ? { status: status as OrderStatus } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { customerName: { contains: search, mode: "insensitive" } },
            { customerPhone: { contains: search } },
          ],
        }
      : {}),
  };
}

export async function getAdminOrders(filters: AdminListFilters = {}) {
  const prisma = getPrisma();
  const where = buildOrderWhere(filters);
  const page = Math.max(1, filters.page ?? 1);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        items: true,
        payment: true,
        shipping: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAdminOrder(orderId: string) {
  return getPrisma().order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payment: true,
      shipping: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getAdminServiceRequests(
  filters: AdminListFilters = {},
) {
  const prisma = getPrisma();
  const search = normalizeSearch(filters.search);
  const status = filters.status?.trim();
  const page = Math.max(1, filters.page ?? 1);

  const where: Prisma.ServiceRequestWhereInput = {
    ...(status && status !== "ALL"
      ? { status: status as ServiceRequestStatus }
      : {}),
    ...(search
      ? {
          OR: [
            { customerName: { contains: search, mode: "insensitive" } },
            { customerPhone: { contains: search } },
            { serviceType: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [requests, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        serviceNotes: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    prisma.serviceRequest.count({ where }),
  ]);

  return {
    requests,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAdminServiceRequest(requestId: string) {
  return getPrisma().serviceRequest.findUnique({
    where: { id: requestId },
    include: {
      serviceNotes: { orderBy: { createdAt: "asc" } },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function getAdminProducts(filters: AdminListFilters = {}) {
  const prisma = getPrisma();
  const search = normalizeSearch(filters.search);
  const status = filters.status?.trim();

  const where: Prisma.ProductWhereInput = {
    ...(status === "ACTIVE"
      ? { isActive: true }
      : status === "HIDDEN"
        ? { isActive: false }
        : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      take: 100,
      include: { category: true },
    }),
    prisma.product.count({ where }),
    prisma.productCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return { products, total, categories };
}

export async function getAdminProduct(productId: string) {
  return getPrisma().product.findUnique({
    where: { id: productId },
    include: { category: true },
  });
}

export async function getAdminCategories() {
  return getPrisma().productCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function getAdminUsers(filters: AdminListFilters = {}) {
  const prisma = getPrisma();
  const search = normalizeSearch(filters.search);
  const role = filters.role?.trim();

  const where: Prisma.UserWhereInput = {
    ...(role && role !== "ALL" ? { role: role as UserRole } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export async function getAdminFaqs() {
  return getPrisma().faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAdminFaq(faqId: string) {
  return getPrisma().faq.findUnique({ where: { id: faqId } });
}

export async function getAdminBlogPosts() {
  return getPrisma().blogPost.findMany({
    orderBy: [{ isPublished: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      readTime: true,
      author: true,
      isPublished: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

export async function getAdminBlogPost(postId: string) {
  return getPrisma().blogPost.findUnique({ where: { id: postId } });
}
