import type { Metadata } from "next";
import { connection } from "next/server";
import {
  CircleExclamationPoint,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AdminFilterBar, AdminSelectFilter } from "@/components/admin/filter-bar";
import {
  CreateStaffForm,
  UserRowActions,
} from "@/components/admin/user-forms";
import { Badge } from "@/components/ui/badge";
import { getAdminUsers } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import { allRoleOptions, roleLabels } from "@/lib/constants/roles";
import type { UserRole } from "@/lib/generated/prisma/enums";
import { formatDate, formatNumber, toTelHref } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "کاربران و نقش‌ها",
};

/** User lists are read per request so role changes appear immediately. */
export const instant = false;

type AdminUsersPageProps = {
  searchParams: Promise<{ search?: string; role?: string }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  await connection();
  const currentUser = await requireAdminPage("users:manage", "/admin/users");

  const params = await searchParams;

  let result: Awaited<ReturnType<typeof getAdminUsers>> | null = null;

  try {
    result = await getAdminUsers({ search: params.search, role: params.role });
  } catch (error) {
    console.error("[admin] users query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-extrabold text-primary sm:text-xl">
          کاربران و نقش‌ها
        </h1>
        <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
          نقش کاربران را تغییر دهید، حساب‌ها را فعال یا غیرفعال کنید و برای کارکنان
          حساب ورود بسازید. تغییر نقش پس از ورود بعدی کاربر اعمال می‌شود.
        </p>
      </div>

      <AdminFilterBar
        action="/admin/users"
        searchValue={params.search}
        searchPlaceholder="نام، ایمیل یا شماره موبایل"
        resetHref="/admin/users"
      >
        <AdminSelectFilter
          name="role"
          label="نقش"
          value={params.role}
          options={allRoleOptions}
        />
      </AdminFilterBar>

      <CreateStaffForm />

      {!result ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت فهرست کاربران در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی
          کنید.
        </div>
      ) : result.users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            کاربری با این فیلترها یافت نشد
          </p>
          <p className="mt-1.5 text-caption text-muted-foreground">
            عبارت جستجو یا فیلتر نقش را تغییر دهید.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {result.users.map((user) => (
            <article
              key={user.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-caption font-extrabold ${
                      user.isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-muted text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {user.name?.trim().charAt(0) || "؟"}
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 text-caption font-bold text-foreground">
                      {user.name?.trim() || "بدون نام"}
                      {user.id === currentUser.id ? (
                        <Badge variant="secondary">حساب شما</Badge>
                      ) : null}
                      <Badge variant={user.role === "CUSTOMER" ? "outline" : "default"}>
                        {user.role === "CUSTOMER" ? (
                          <UserRound className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        )}
                        {roleLabels[user.role]}
                      </Badge>
                      <Badge variant={user.isActive ? "success" : "danger"}>
                        {user.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground">
                      {user.email ? (
                        <span className="inline-flex items-center gap-1" dir="ltr">
                          <Mail className="h-3 w-3" aria-hidden="true" />
                          {user.email}
                        </span>
                      ) : null}
                      <a
                        href={toTelHref(user.phone)}
                        dir="ltr"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Phone className="h-3 w-3" aria-hidden="true" />
                        {user.phone}
                      </a>
                      <span>{formatNumber(user._count.orders)} سفارش</span>
                      <span>
                        آخرین ورود:{" "}
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : "ثبت نشده"}
                      </span>
                      <span>عضویت: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <UserRowActions
                  userId={user.id}
                  role={user.role as UserRole}
                  isActive={user.isActive}
                  isSelf={user.id === currentUser.id}
                />
              </div>
            </article>
          ))}

          <p className="text-caption text-muted-foreground">
            نمایش {formatNumber(result.users.length)} کاربر از{" "}
            {formatNumber(result.total)} مورد مطابق فیلتر.
          </p>
        </div>
      )}

      <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-3 text-caption leading-5 text-muted-foreground">
        محافظت‌ها: آخرین مدیر ارشد فعال قابل حذف یا غیرفعال‌سازی نیست و هر مدیر
        نمی‌تواند نقش یا وضعیت حساب خودش را تغییر دهد. این قواعد در سرور نیز
        اعمال می‌شوند، نه فقط در رابط کاربری.
      </p>
    </div>
  );
}
