"use server";

import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db/prisma";
import { getAdminActionUser } from "@/lib/auth/session";
import type { ServiceRequestStatus } from "@/lib/generated/prisma/enums";

export type ServiceActionResult =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "FORBIDDEN" | "INVALID" | "NOT_FOUND" | "DB_UNAVAILABLE";
      message: string;
    };

const SERVICE_STATUSES: ServiceRequestStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

function refreshService(requestId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${requestId}`);
  revalidatePath("/account/services");
}

export async function updateServiceStatus(input: {
  requestId: string;
  status: string;
  assignedTo?: string;
}): Promise<ServiceActionResult> {
  const admin = await getAdminActionUser("services:write");

  if (!admin) {
    return {
      ok: false,
      code: "FORBIDDEN",
      message: "برای انجام این عملیات مجوز ندارید.",
    };
  }

  if (
    !input.requestId ||
    !SERVICE_STATUSES.includes(input.status as ServiceRequestStatus)
  ) {
    return {
      ok: false,
      code: "INVALID",
      message: "وضعیت انتخاب‌شده معتبر نیست.",
    };
  }

  try {
    const prisma = getPrisma();
    const request = await prisma.serviceRequest.findUnique({
      where: { id: input.requestId },
      select: { id: true, status: true },
    });

    if (!request) {
      return { ok: false, code: "NOT_FOUND", message: "درخواست یافت نشد." };
    }

    await prisma.serviceRequest.update({
      where: { id: request.id },
      data: {
        status: input.status as ServiceRequestStatus,
        assignedTo: input.assignedTo?.trim() || undefined,
      },
    });

    await prisma.serviceRequestNote.create({
      data: {
        requestId: request.id,
        author: admin.name ?? "مدیر",
        note: `وضعیت درخواست به ${input.status} تغییر کرد.`,
      },
    });

    refreshService(input.requestId);

    return { ok: true, message: "وضعیت درخواست به‌روزرسانی شد." };
  } catch (error) {
    console.error("[admin] update service status failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "به‌روزرسانی وضعیت درخواست در حال حاضر ممکن نیست.",
    };
  }
}

export async function addServiceNote(input: {
  requestId: string;
  note: string;
}): Promise<ServiceActionResult> {
  const admin = await getAdminActionUser("services:write");

  if (!admin) {
    return {
      ok: false,
      code: "FORBIDDEN",
      message: "برای انجام این عملیات مجوز ندارید.",
    };
  }

  const note = input.note?.trim();

  if (!input.requestId || !note) {
    return {
      ok: false,
      code: "INVALID",
      message: "متن یادداشت را وارد کنید.",
    };
  }

  if (note.length > 1000) {
    return {
      ok: false,
      code: "INVALID",
      message: "یادداشت نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد.",
    };
  }

  try {
    const prisma = getPrisma();
    const request = await prisma.serviceRequest.findUnique({
      where: { id: input.requestId },
      select: { id: true },
    });

    if (!request) {
      return { ok: false, code: "NOT_FOUND", message: "درخواست یافت نشد." };
    }

    await prisma.serviceRequestNote.create({
      data: {
        requestId: request.id,
        author: admin.name ?? "مدیر",
        note,
      },
    });

    refreshService(input.requestId);

    return { ok: true, message: "یادداشت داخلی ثبت شد." };
  } catch (error) {
    console.error("[admin] add service note failed", error);
    return {
      ok: false,
      code: "DB_UNAVAILABLE",
      message: "ثبت یادداشت در حال حاضر ممکن نیست.",
    };
  }
}
