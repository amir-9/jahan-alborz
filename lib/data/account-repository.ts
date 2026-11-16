import { getPrisma } from "@/lib/db/prisma";

/**
 * Customer-scoped reads. Every function takes the authenticated user id so a
 * caller cannot accidentally fetch another customer's records.
 */

export async function getCustomerOrders(userId: string) {
  return getPrisma().order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payment: true,
      shipping: true,
    },
  });
}

export async function getCustomerOrder(userId: string, orderId: string) {
  return getPrisma().order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: true,
      payment: true,
      shipping: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getCustomerServiceRequests(userId: string) {
  return getPrisma().serviceRequest.findMany({
    where: { customerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      serviceNotes: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getCustomerAddresses(userId: string) {
  return getPrisma().address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function getCustomerOrderSummary(userId: string) {
  const prisma = getPrisma();

  const [orderCount, serviceCount, pendingOrders, latestOrder] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.serviceRequest.count({ where: { customerId: userId } }),
      prisma.order.count({
        where: { userId, status: { in: ["PENDING", "AWAITING_PAYMENT"] } },
      }),
      prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

  return { orderCount, serviceCount, pendingOrders, latestOrder };
}

/** Used by the public confirmation page with an explicit access check. */
export async function getOrderByNumber(orderNumber: string) {
  return getPrisma().order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payment: true,
      shipping: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
}
