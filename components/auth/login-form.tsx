"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  CircleExclamationPoint,
  KeyRound,
  LoaderCircle,
  LogIn,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { FormField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestLoginOtp } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";

type LoginMode = "otp" | "password" | "staff";

type LoginFormProps = {
  callbackUrl: string;
  initialError?: string;
};

const modes: { value: LoginMode; label: string }[] = [
  { value: "otp", label: "ورود با کد تأیید" },
  { value: "password", label: "ورود با رمز عبور" },
  { value: "staff", label: "ورود کارکنان" },
];

export function LoginForm({ callbackUrl, initialError }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("otp");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  function switchMode(nextMode: LoginMode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
    setCode("");
  }

  /** Roving tabindex keyboard support for the RTL login-mode tablist. */
  function handleTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = modes.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowLeft") nextIndex = index === last ? 0 : index + 1;
    if (event.key === "ArrowRight") nextIndex = index === 0 ? last : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = last;

    if (nextIndex === null) return;

    event.preventDefault();
    switchMode(modes[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  }

  async function handleSendOtp() {
    setPending(true);
    setError(null);
    setNotice(null);

    try {
      const result = await requestLoginOtp({ phone });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setOtpSent(true);
      setNotice(result.message);
      setCooldown(result.retryAfterSeconds ?? 60);
    } catch {
      setError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.");
    } finally {
      setPending(false);
    }
  }

  async function finishSignIn(
    provider: "customer-otp" | "customer-password" | "admin",
    credentials: Record<string, string>,
    target: string,
  ) {
    setPending(true);
    setError(null);

    try {
      const result = await signIn(provider, {
        ...credentials,
        redirect: false,
        callbackUrl: target,
      });

      if (!result || result.error) {
        setError(
          provider === "customer-otp"
            ? "کد تأیید معتبر نیست یا منقضی شده است. برای دریافت کد جدید تلاش کنید."
            : provider === "admin"
              ? "ایمیل یا رمز عبور کارکنان نادرست است."
              : "شماره موبایل یا رمز عبور نادرست است.",
        );
        return;
      }

      router.push(target);
      router.refresh();
    } catch {
      setError("ورود انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      setPending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "otp") {
      if (!otpSent) {
        await handleSendOtp();
        return;
      }

      await finishSignIn(
        "customer-otp",
        { identifier: phone, password: code },
        callbackUrl,
      );
      return;
    }

    if (mode === "password") {
      await finishSignIn(
        "customer-password",
        { identifier: phone, password },
        callbackUrl,
      );
      return;
    }

    await finishSignIn(
      "admin",
      { email, password },
      callbackUrl === "/account" ? "/admin" : callbackUrl,
    );
  }

  const isStaff = mode === "staff";

  return (
    <div className="animate-rise w-full max-w-md rounded-3xl border border-border bg-surface/95 p-6 shadow-float backdrop-blur sm:p-8">
      <div className="text-center">
        <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <span className="absolute inset-0 rounded-2xl bg-secondary/10 blur-md" aria-hidden="true" />
          <KeyRound className="relative h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold text-primary">ورود به حساب</h1>
        <p className="mt-2 text-caption leading-6 text-muted-foreground">
          برای پیگیری سفارش‌ها و درخواست‌های خدمات وارد شوید. ورود مشتریان با
          شماره موبایل انجام می‌شود.
        </p>
      </div>

      <div
        className="mt-5 grid grid-cols-3 gap-1 rounded-xl border border-border/70 bg-surface-muted p-1"
        role="tablist"
        aria-label="روش ورود"
      >
        {modes.map((item, index) => (
          <button
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`login-tab-${item.value}`}
            type="button"
            role="tab"
            aria-selected={mode === item.value}
            aria-controls={`login-panel-${item.value}`}
            tabIndex={mode === item.value ? 0 : -1}
            onClick={() => switchMode(item.value)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={cn(
              "rounded-lg px-2 py-2 text-caption font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mode === item.value
                ? "bg-surface text-primary shadow-sm"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        role="tabpanel"
        id={`login-panel-${mode}`}
        aria-labelledby={`login-tab-${mode}`}
        className="mt-5 flex flex-col gap-4"
      >
        {error ? (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-caption leading-6 text-danger"
            role="alert"
          >
            <CircleExclamationPoint
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        ) : null}

        {notice && !error ? (
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-caption leading-6 text-teal-800">
            {notice}
          </div>
        ) : null}

        {isStaff ? (
          <>
            <FormField label="ایمیل کارکنان" htmlFor="staff-email" required>
              <div className="relative" dir="ltr">
                <Mail
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="staff-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  autoComplete="username"
                  className="pe-10 text-left"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </FormField>

            <FormField label="رمز عبور" htmlFor="staff-password" required>
              <Input
                id="staff-password"
                name="password"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                className="text-left"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </FormField>

            <p className="flex items-start gap-1.5 rounded-xl bg-surface-muted px-3 py-2 text-caption leading-5 text-muted-foreground">
              <ShieldCheck
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                aria-hidden="true"
              />
              این بخش مخصوص مدیران و کارکنان مجاز است. تلاش‌های ناموفق محدود
              می‌شوند.
            </p>
          </>
        ) : (
          <>
            <FormField
              label="شماره موبایل"
              htmlFor="login-phone"
              required
              hint="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            >
              <div className="relative" dir="ltr">
                <Phone
                  className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="login-phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  className="pe-10 text-left"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    if (otpSent) {
                      setOtpSent(false);
                      setCode("");
                    }
                  }}
                  required
                />
              </div>
            </FormField>

            {mode === "otp" ? (
              otpSent ? (
                <FormField
                  label="کد تأیید ۶ رقمی"
                  htmlFor="login-code"
                  required
                  hint="کد ارسال‌شده را در این کادر وارد کنید."
                >
                  <Input
                    id="login-code"
                    name="code"
                    type="text"
                    dir="ltr"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="text-center text-lg font-bold tracking-[0.4em]"
                    placeholder="------"
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, ""))
                    }
                    required
                  />
                </FormField>
              ) : null
            ) : (
              <FormField label="رمز عبور" htmlFor="login-password" required>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  dir="ltr"
                  autoComplete="current-password"
                  className="text-left"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </FormField>
            )}

            {mode === "otp" ? (
              <div className="flex items-center justify-between gap-2 text-caption">
                <span className="text-muted-foreground">
                  {otpSent
                    ? "کد را دریافت نکردید؟"
                    : "برای دریافت کد روی دکمه زیر بزنید."}
                </span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={pending || cooldown > 0 || phone.trim().length < 10}
                  className="font-semibold text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                >
                  {cooldown > 0
                    ? `ارسال دوباره در ${cooldown} ثانیه`
                    : otpSent
                      ? "ارسال دوباره کد"
                      : "ارسال کد تأیید"}
                </button>
              </div>
            ) : null}
          </>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : isStaff ? (
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}
          {mode === "otp" && !otpSent ? "دریافت کد تأیید" : "ورود"}
        </Button>
      </form>

      {!isStaff ? (
        <p className="mt-5 text-center text-caption text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <Link
            href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-primary hover:underline"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      ) : null}

      <p className="mt-4 border-t border-border pt-4 text-center text-caption leading-5 text-muted-foreground">
        با ورود،{" "}
        <Link
          href="/terms"
          className="font-semibold text-primary hover:underline"
        >
          قوانین خرید
        </Link>{" "}
        و{" "}
        <Link
          href="/privacy"
          className="font-semibold text-primary hover:underline"
        >
          حریم خصوصی
        </Link>{" "}
        فروشگاه را میپذیرید.
      </p>
    </div>
  );
}
