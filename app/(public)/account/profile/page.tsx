import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ProfileForm } from "@/components/account/profile-form";
import { getPrisma } from "@/lib/db/prisma";
import { requireUserPage } from "@/lib/auth/session";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "اطلاعات حساب",
  description: "ویرایش اطلاعات حساب کاربری مشتریان جهان البرز.",
  path: "/account/profile",
  noIndex: true,
});

/** Profile data is read from the database per request. */
export const instant = false;

export default async function AccountProfilePage() {
  const user = await requireUserPage("/account/profile");

  let name = user.name ?? "";
  let email = user.email ?? "";

  try {
    const record = await getPrisma().user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    });

    if (record) {
      name = record.name ?? "";
      email = record.email ?? "";
    }
  } catch (error) {
    console.error("[account] profile query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-extrabold text-primary">اطلاعات حساب</h2>
        <p className="mt-1 text-caption leading-6 text-muted-foreground">
          اطلاعات تماس خود را به‌روز نگه دارید تا هماهنگی سفارش و خدمات سریع‌تر
          انجام شود.
        </p>
      </div>

      <ProfileForm initialName={name} initialEmail={email} phone={user.phone ?? ""} />

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
          <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
          امنیت حساب
        </h3>
        <p className="mt-2 text-caption leading-6 text-muted-foreground">
          ورود به حساب با کد یک‌بارمصرف انجام می‌شود. اگر رمز عبور خود را فراموش
          کردید، از صفحه ورود گزینه «ورود با کد تأیید» را انتخاب کنید.
        </p>
      </div>
    </div>
  );
}
