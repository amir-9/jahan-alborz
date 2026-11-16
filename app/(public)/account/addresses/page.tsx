import type { Metadata } from "next";
import { CircleExclamationPoint } from "lucide-react";
import { AddressForm } from "@/components/account/address-form";
import { AddressCardActions } from "@/components/account/address-card-actions";
import { Badge } from "@/components/ui/badge";
import { getCustomerAddresses } from "@/lib/data/account-repository";
import { requireUserPage } from "@/lib/auth/session";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "آدرس‌های من",
  description: "مدیریت آدرس‌های تحویل سفارش مشتریان جهان البرز.",
  path: "/account/addresses",
  noIndex: true,
});

/** Address data is read from the database per request. */
export const instant = false;

export default async function AccountAddressesPage() {
  const user = await requireUserPage("/account/addresses");

  let addresses: Awaited<ReturnType<typeof getCustomerAddresses>> = [];
  let failed = false;

  try {
    addresses = await getCustomerAddresses(user.id);
  } catch (error) {
    console.error("[account] addresses query failed", error);
    failed = true;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-extrabold text-primary">آدرس‌های من</h2>
        <p className="mt-1 text-[11.5px] leading-6 text-muted-foreground">
          آدرس‌های ذخیره‌شده را مدیریت کنید. در مرحله نهایی سفارش می‌توانید آدرس
          تحویل را انتخاب یا ویرایش کنید.
        </p>
      </div>

      {failed ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11.5px] leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت آدرس‌ها در حال حاضر ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید.
        </div>
      ) : null}

      <AddressForm />

      {addresses.length === 0 && !failed ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-8 text-center text-[11.5px] leading-6 text-muted-foreground shadow-soft">
          هنوز آدرسی ذخیره نکرده‌اید. با افزودن آدرس، ثبت سفارش سریع‌تر می‌شود.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((address) => (
          <article
            key={address.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11.5px] font-bold text-primary">
                  {address.label?.trim() || "آدرس تحویل"}
                </p>
                <p className="mt-1 text-[11px] text-foreground">
                  {address.recipient}
                </p>
              </div>
              {address.isDefault ? (
                <Badge variant="success">پیش‌فرض</Badge>
              ) : null}
            </div>

            <p className="mt-2 text-[11px] leading-6 text-muted-foreground">
              {address.province}، {address.city}، {address.street}
            </p>
            <p className="mt-1 text-[10.5px] text-muted-foreground" dir="ltr">
              {address.phone}
              {address.postalCode ? ` · ${address.postalCode}` : ""}
            </p>

            <AddressCardActions id={address.id} isDefault={address.isDefault} />
          </article>
        ))}
      </div>
    </div>
  );
}
