"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  LockKeyhole,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { ProductVisual } from "@/components/shared/product-visual";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  requestCheckoutOtp,
  verifyCheckoutOtp,
} from "@/lib/actions/auth";
import { createOrder } from "@/lib/actions/order";
import { shippingMethodLabels, shippingMethodOptions } from "@/lib/constants/status";
import { useCartStore } from "@/lib/stores/cart-store";
import { checkoutSchema } from "@/lib/validation/order";
import { normalizeIranMobile } from "@/lib/utils/normalize";
import { formatNumber, formatPrice } from "@/lib/utils/format";

type CheckoutFormProps = {
  sessionPhone: string | null;
  initialName: string;
  initialPhone: string;
  initialEmail: string;
  initialProvince: string;
  initialCity: string;
  initialAddress: string;
  initialPostalCode: string;
};

const initialShippingNotes: Record<string, string> = {
  POST: "ارسال از طریق پست به سراسر ایران.",
  TIPAX: "ارسال از طریق تیپاکس؛ زمان تحویل پس از هماهنگی اعلام می‌شود.",
  FREIGHT: "ارسال باربری برای محموله‌های حجیم؛ هزینه پس از تأیید فروشگاه.",
  LOCAL: "پیک محلی فقط برای شهر قزوین؛ زمان هماهنگ می‌شود.",
};

export function CheckoutForm({
  sessionPhone,
  initialName,
  initialPhone,
  initialEmail,
  initialProvince,
  initialCity,
  initialAddress,
  initialPostalCode,
}: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [values, setValues] = useState({
    customerName: initialName,
    customerPhone: initialPhone,
    customerEmail: initialEmail,
    province: initialProvince,
    city: initialCity,
    shippingAddress: initialAddress,
    postalCode: initialPostalCode,
    shippingMethod: "POST" as keyof typeof shippingMethodLabels,
    paymentMethod: "ONLINE" as "ONLINE" | "COD",
    notes: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpPending, setOtpPending] = useState(false);
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);

  const idempotencyKeyRef = useRef("");

  useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }
  }, []);

  useEffect(() => {
    if (otpCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setOtpCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  const normalizedPhone = normalizeIranMobile(values.customerPhone);
  const needsVerification =
    !sessionPhone || normalizedPhone !== sessionPhone;
  const isVerified = !needsVerification || verifiedPhone === normalizedPhone;

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError(null);

    if (field === "customerPhone" && verifiedPhone) {
      setVerifiedPhone(null);
      setOtpSent(false);
      setOtpCode("");
      setOtpNotice(null);
    }
  }

  async function handleSendOtp() {
    setOtpPending(true);
    setOtpError(null);
    setOtpNotice(null);

    try {
      const result = await requestCheckoutOtp({ phone: values.customerPhone });

      if (!result.ok) {
        setOtpError(result.message);
        return;
      }

      setOtpSent(true);
      setOtpNotice(result.message);
      setOtpCooldown(result.retryAfterSeconds ?? 60);
    } catch {
      setOtpError("ارسال کد تأیید انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setOtpPending(false);
    }
  }

  async function handleVerifyOtp() {
    setOtpPending(true);
    setOtpError(null);

    try {
      const result = await verifyCheckoutOtp({
        phone: values.customerPhone,
        code: otpCode,
      });

      if (!result.ok) {
        setOtpError(result.message);
        return;
      }

      setVerifiedPhone(normalizedPhone);
      setOtpNotice("شماره موبایل تأیید شد. اکنون می‌توانید سفارش را ثبت کنید.");
    } catch {
      setOtpError("بررسی کد تأیید انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setOtpPending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("سبد خرید خالی است. ابتدا محصولی به سبد اضافه کنید.");
      return;
    }

    if (!isVerified) {
      setError("برای ثبت سفارش، ابتدا شماره موبایل خود را با کد تأیید کنید.");
      return;
    }

    const parsed = checkoutSchema.safeParse({
      ...values,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      idempotencyKey: idempotencyKeyRef.current || crypto.randomUUID(),
    });

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      setError("لطفاً خطاهای فرم را بررسی کنید.");
      return;
    }

    setPending(true);

    try {
      const result = await createOrder(parsed.data);

      if (!result.ok) {
        setError(result.message);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        return;
      }

      clearCart();
      router.push(`/checkout/confirmation/${result.orderNumber}`);
      router.refresh();
    } catch {
      setError(
        "ثبت سفارش انجام نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.",
      );
    } finally {
      setPending(false);
    }
  }

  if (hasHydrated && items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center shadow-soft">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-extrabold text-primary">
          سبد خرید شما خالی است
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[12px] leading-7 text-muted-foreground">
          برای ثبت سفارش، ابتدا محصول مورد نظر را از فروشگاه انتخاب کنید.
        </p>
        <Button asChild className="mt-5">
          <Link href="/shop">مشاهده فروشگاه</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5 lg:grid-cols-[1fr_21rem] lg:items-start"
    >
      <div className="flex flex-col gap-4">
        {error ? (
          <div
            className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[11.5px] leading-6 text-danger"
            role="alert"
          >
            <CircleExclamationPoint
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        ) : null}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">اطلاعات تحویل</h2>
          <p className="mt-1 text-[11px] leading-6 text-muted-foreground">
            نام و شماره تماس را دقیق وارد کنید؛ هماهنگی نهایی سفارش با همین شماره
            انجام می‌شود.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <CheckoutField
              label="نام و نام خانوادگی"
              htmlFor="checkout-name"
              required
              error={fieldErrors.customerName?.[0]}
            >
              <Input
                id="checkout-name"
                autoComplete="name"
                value={values.customerName}
                onChange={(event) => update("customerName", event.target.value)}
                required
              />
            </CheckoutField>

            <CheckoutField
              label="شماره موبایل"
              htmlFor="checkout-phone"
              required
              error={fieldErrors.customerPhone?.[0]}
            >
              <Input
                id="checkout-phone"
                type="tel"
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                className="text-left"
                placeholder="09123456789"
                value={values.customerPhone}
                onChange={(event) => update("customerPhone", event.target.value)}
                required
              />
            </CheckoutField>

            <CheckoutField
              label="ایمیل (اختیاری)"
              htmlFor="checkout-email"
              error={fieldErrors.customerEmail?.[0]}
            >
              <Input
                id="checkout-email"
                type="email"
                dir="ltr"
                className="text-left"
                autoComplete="email"
                value={values.customerEmail}
                onChange={(event) =>
                  update("customerEmail", event.target.value)
                }
              />
            </CheckoutField>

            <CheckoutField
              label="کد پستی (اختیاری)"
              htmlFor="checkout-postal-code"
              error={fieldErrors.postalCode?.[0]}
            >
              <Input
                id="checkout-postal-code"
                dir="ltr"
                inputMode="numeric"
                maxLength={10}
                className="text-left"
                value={values.postalCode}
                onChange={(event) => update("postalCode", event.target.value)}
              />
            </CheckoutField>

            <CheckoutField
              label="استان"
              htmlFor="checkout-province"
              required
              error={fieldErrors.province?.[0]}
            >
              <Input
                id="checkout-province"
                value={values.province}
                onChange={(event) => update("province", event.target.value)}
                required
              />
            </CheckoutField>

            <CheckoutField
              label="شهر"
              htmlFor="checkout-city"
              required
              error={fieldErrors.city?.[0]}
            >
              <Input
                id="checkout-city"
                value={values.city}
                onChange={(event) => update("city", event.target.value)}
                required
              />
            </CheckoutField>

            <CheckoutField
              label="نشانی کامل تحویل"
              htmlFor="checkout-address"
              required
              error={fieldErrors.shippingAddress?.[0]}
              className="sm:col-span-2"
            >
              <Input
                id="checkout-address"
                autoComplete="street-address"
                value={values.shippingAddress}
                onChange={(event) =>
                  update("shippingAddress", event.target.value)
                }
                required
              />
            </CheckoutField>
          </div>
        </section>

        {needsVerification ? (
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
              <LockKeyhole
                className="h-4 w-4 text-secondary"
                aria-hidden="true"
              />
              تأیید شماره موبایل
            </h2>
            <p className="mt-1 text-[11px] leading-6 text-muted-foreground">
              برای ثبت سفارش مهمان، شماره موبایل باید با کد یک‌بارمصرف تأیید شود.
              کد ارسال‌شده تا ۵ دقیقه معتبر است.
            </p>

            {otpNotice ? (
              <p className="mt-3 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-[11px] leading-6 text-teal-800">
                <CircleCheck
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {otpNotice}
              </p>
            ) : null}

            {otpError ? (
              <p
                className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[11px] leading-6 text-danger"
                role="alert"
              >
                <CircleExclamationPoint
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {otpError}
              </p>
            ) : null}

            {verifiedPhone === normalizedPhone ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-[11px] font-semibold text-success">
                <CircleCheck className="h-4 w-4" aria-hidden="true" />
                شماره تأیید شده است
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label htmlFor="checkout-otp">کد تأیید ۶ رقمی</Label>
                  <Input
                    id="checkout-otp"
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="text-center font-bold tracking-[0.4em]"
                    placeholder="------"
                    value={otpCode}
                    onChange={(event) =>
                      setOtpCode(event.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendOtp}
                    disabled={otpPending || otpCooldown > 0}
                  >
                    {otpPending ? (
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}
                    {otpCooldown > 0
                      ? `${otpCooldown} ثانیه`
                      : otpSent
                        ? "ارسال دوباره"
                        : "ارسال کد"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpPending || otpCode.length !== 6}
                  >
                    تأیید کد
                  </Button>
                </div>
              </div>
            )}
          </section>
        ) : null}

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
            <Truck className="h-4 w-4 text-secondary" aria-hidden="true" />
            روش ارسال
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {shippingMethodOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-3.5 py-3 text-[11.5px] transition-colors ${
                  values.shippingMethod === option.value
                    ? "border-primary bg-primary-50/60 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={option.value}
                    checked={values.shippingMethod === option.value}
                    onChange={() => update("shippingMethod", option.value)}
                    className="h-3.5 w-3.5 accent-[var(--primary)]"
                  />
                  {option.label}
                </span>
                <span className="ps-5 text-[10px] leading-5">
                  {initialShippingNotes[option.value]}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-surface-muted px-3 py-2 text-[10.5px] leading-5 text-muted-foreground">
            هزینه ارسال به‌صورت دستی توسط فروشگاه تعیین و پیش از ارسال با شما
            هماهنگ می‌شود. در این مرحله مبلغی بابت ارسال محاسبه نشده است.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">روش پرداخت</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-3.5 py-3 text-[11.5px] transition-colors ${
                values.paymentMethod === "ONLINE"
                  ? "border-primary bg-primary-50/60 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={values.paymentMethod === "ONLINE"}
                  onChange={() => update("paymentMethod", "ONLINE")}
                  className="h-3.5 w-3.5 accent-[var(--primary)]"
                />
                پرداخت آنلاین
              </span>
              <span className="ps-5 text-[10px] leading-5">
                درگاه پرداخت در این نسخه فعال نیست؛ سفارش ثبت و برای پرداخت
                هماهنگ می‌شود.
              </span>
            </label>

            <label
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-3.5 py-3 text-[11.5px] transition-colors ${
                values.paymentMethod === "COD"
                  ? "border-primary bg-primary-50/60 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={values.paymentMethod === "COD"}
                  onChange={() => update("paymentMethod", "COD")}
                  className="h-3.5 w-3.5 accent-[var(--primary)]"
                />
                پرداخت در محل
              </span>
              <span className="ps-5 text-[10px] leading-5">
                مبلغ سفارش هنگام تحویل دریافت می‌شود. هماهنگی با فروشگاه انجام
                می‌گیرد.
              </span>
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="checkout-notes">توضیحات سفارش (اختیاری)</Label>
            <Textarea
              id="checkout-notes"
              rows={3}
              maxLength={500}
              placeholder="زمان مناسب تحویل، توضیح درباره نشانی یا هماهنگی اضافه"
              value={values.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
            {fieldErrors.notes?.[0] ? (
              <p className="text-[10.5px] font-medium text-danger" role="alert">
                {fieldErrors.notes[0]}
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-bold text-primary">خلاصه سفارش</h2>

          <div className="mt-3 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <ProductVisual
                    variant={item.visual}
                    className="h-9 w-9"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-primary">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatNumber(item.quantity)} عدد
                  </p>
                </div>
                <p className="text-[10.5px] font-semibold text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <dl className="flex flex-col gap-2 text-[11.5px]">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">جمع کالاها</dt>
              <dd className="font-semibold text-foreground">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">هزینه ارسال</dt>
              <dd className="text-[10.5px] text-muted-foreground">
                پس از تأیید فروشگاه
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <dt className="font-bold text-primary">مبلغ قابل پرداخت</dt>
              <dd className="text-sm font-extrabold text-primary">
                {formatPrice(subtotal)}
              </dd>
            </div>
          </dl>

          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full"
            disabled={pending || !isVerified}
          >
            {pending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            )}
            {pending ? "در حال ثبت سفارش" : "ثبت سفارش"}
          </Button>

          <p className="mt-3 text-[10px] leading-5 text-muted-foreground">
            مبلغ نهایی بر اساس قیمت‌های ثبت‌شده فروشگاه و پس از بررسی موجودی
            محاسبه می‌شود. سفارش تا تأیید پرداخت، پرداخت‌شده محسوب نمی‌شود.
          </p>
        </div>
      </aside>
    </form>
  );
}

type CheckoutFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

function CheckoutField({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: CheckoutFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ms-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-[10.5px] font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
