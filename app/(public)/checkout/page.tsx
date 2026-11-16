import type { Metadata } from "next";
import { connection } from "next/server";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/db/prisma";
import { getSession, toSessionUser } from "@/lib/auth/session";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "تکمیل سفارش",
  description: "تکمیل اطلاعات سفارش و انتخاب روش ارسال و پرداخت.",
  path: "/checkout",
  noIndex: true,
});

/** Checkout validates cart items against the database per request. */
export const instant = false;

export default async function CheckoutPage() {
  await connection();

  const user = toSessionUser(await getSession());

  let profile: {
    name: string;
    phone: string;
    email: string;
    province: string;
    city: string;
    street: string;
    postalCode: string;
  } = {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    province: "قزوین",
    city: "قزوین",
    street: "",
    postalCode: "",
  };

  if (user) {
    try {
      const record = await getPrisma().user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          phone: true,
          email: true,
          addresses: {
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
            take: 1,
            select: {
              province: true,
              city: true,
              street: true,
              postalCode: true,
            },
          },
        },
      });

      if (record) {
        const address = record.addresses[0];

        profile = {
          name: record.name ?? "",
          phone: record.phone,
          email: record.email ?? "",
          province: address?.province ?? profile.province,
          city: address?.city ?? profile.city,
          street: address?.street ?? "",
          postalCode: address?.postalCode ?? "",
        };
      }
    } catch (error) {
      console.error("[checkout] profile prefill failed", error);
    }
  }

  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { name: "سبد خرید", href: "/cart" },
          { name: "تکمیل سفارش" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="secondary">مرحله نهایی</Badge>
          <h1 className="mt-3 text-2xl font-extrabold text-primary sm:text-3xl">
            تکمیل سفارش
          </h1>
          <p className="mt-2 max-w-2xl text-[12px] leading-7 text-muted-foreground">
            اطلاعات تحویل را وارد کنید. پس از ثبت، موجودی و هزینه ارسال توسط
            فروشگاه بررسی و برای تأیید نهایی با شما تماس گرفته می‌شود.
          </p>
        </div>
        <Badge variant="outline">
          {user ? "خرید با حساب کاربری" : "خرید مهمان با تأیید موبایل"}
        </Badge>
      </div>

      <div className="mt-6">
        <CheckoutForm
          sessionPhone={user?.phone ?? null}
          initialName={profile.name}
          initialPhone={profile.phone}
          initialEmail={profile.email}
          initialProvince={profile.province}
          initialCity={profile.city}
          initialAddress={profile.street}
          initialPostalCode={profile.postalCode}
        />
      </div>
    </div>
  );
}
