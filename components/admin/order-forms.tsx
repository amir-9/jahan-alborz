"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  updateOrderPayment,
  updateOrderShipping,
  updateOrderStatus,
} from "@/lib/actions/admin-orders";
import { orderStatusOptions } from "@/lib/constants/status";

type OrderStatusFormProps = {
  orderId: string;
  currentStatus: string;
  isCancelled: boolean;
};

export function OrderStatusForm({
  orderId,
  currentStatus,
  isCancelled,
}: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [result, setResult] = useState<
    { ok: true; message: string } | { ok: false; message: string } | null
  >(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await updateOrderStatus({ orderId, status, note });

      setResult(response);

      if (response.ok) {
        setNote("");
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <h2 className="text-sm font-bold text-primary">وضعیت سفارش</h2>
      <p className="mt-1 text-caption leading-5 text-muted-foreground">
        تغییر وضعیت در تاریخچه سفارش ثبت می‌شود. لغو سفارش، موجودی کالاها را
        برمی‌گرداند و لغو قابل بازگشت نیست.
      </p>

      {isCancelled ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-caption leading-5 text-danger">
          این سفارش لغو شده است و وضعیت آن قابل تغییر نیست.
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order-status">وضعیت جدید</Label>
          <Select
            id="order-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={isCancelled || pending}
          >
            {orderStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order-status-note">یادداشت تغییر وضعیت (اختیاری)</Label>
          <Textarea
            id="order-status-note"
            rows={2}
            maxLength={300}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="مثال: هماهنگی تلفنی با مشتری انجام شد."
            disabled={isCancelled || pending}
          />
        </div>
      </div>

      {result ? (
        <p
          className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-caption leading-5 ${
            result.ok
              ? "border border-teal-200 bg-teal-50 text-teal-800"
              : "border border-red-200 bg-red-50 text-danger"
          }`}
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <CircleExclamationPoint
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
          )}
          {result.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        className="mt-3"
        disabled={isCancelled || pending || status === currentStatus}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ثبت وضعیت
      </Button>
    </form>
  );
}

type OrderPaymentFormProps = {
  orderId: string;
  currentStatus: string;
};

const paymentOptions = [
  { value: "PENDING", label: "در انتظار پرداخت" },
  { value: "PAID", label: "پرداخت شده" },
  { value: "FAILED", label: "ناموفق" },
  { value: "REFUNDED", label: "بازپرداخت شده" },
];

export function OrderPaymentForm({
  orderId,
  currentStatus,
}: OrderPaymentFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [result, setResult] = useState<
    { ok: true; message: string } | { ok: false; message: string } | null
  >(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await updateOrderPayment({ orderId, status });

      setResult(response);

      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <h2 className="text-sm font-bold text-primary">وضعیت پرداخت</h2>
      <p className="mt-1 text-caption leading-5 text-muted-foreground">
        فقط زمانی «پرداخت شده» را انتخاب کنید که واریز واقعاً تأیید شده باشد.
        تأیید دستی بدون بررسی، سابقه مالی نادرست ایجاد می‌کند.
      </p>

      <div className="mt-3 flex flex-col gap-1.5">
        <Label htmlFor="payment-status">وضعیت پرداخت</Label>
        <Select
          id="payment-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          disabled={pending}
        >
          {paymentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {result ? (
        <p
          className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-caption leading-5 ${
            result.ok
              ? "border border-teal-200 bg-teal-50 text-teal-800"
              : "border border-red-200 bg-red-50 text-danger"
          }`}
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <CircleExclamationPoint
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
          )}
          {result.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        className="mt-3"
        disabled={pending || status === currentStatus}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ثبت وضعیت پرداخت
      </Button>
    </form>
  );
}

type OrderShippingFormProps = {
  orderId: string;
  currentMethod: string;
  currentCost: number;
  currentTrackingCode: string;
  currentNotes: string;
  disabled: boolean;
};

const shippingOptions = [
  { value: "POST", label: "پست" },
  { value: "TIPAX", label: "تیپاکس" },
  { value: "FREIGHT", label: "باربری" },
  { value: "LOCAL", label: "پیک محلی قزوین" },
];

export function OrderShippingForm({
  orderId,
  currentMethod,
  currentCost,
  currentTrackingCode,
  currentNotes,
  disabled,
}: OrderShippingFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState(currentMethod);
  const [cost, setCost] = useState(String(currentCost));
  const [trackingCode, setTrackingCode] = useState(currentTrackingCode);
  const [notes, setNotes] = useState(currentNotes);
  const [result, setResult] = useState<
    { ok: true; message: string } | { ok: false; message: string } | null
  >(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await updateOrderShipping({
        orderId,
        method,
        cost: Number(cost) || 0,
        trackingCode,
        notes,
      });

      setResult(response);

      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <h2 className="text-sm font-bold text-primary">ارسال و هزینه</h2>
      <p className="mt-1 text-caption leading-5 text-muted-foreground">
        هزینه ارسال دستی تعیین می‌شود و مبلغ نهایی سفارش را به‌روز می‌کند. پس از
        تأیید پرداخت، هزینه ارسال قفل می‌شود.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shipping-method">روش ارسال</Label>
          <Select
            id="shipping-method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            disabled={disabled || pending}
          >
            {shippingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shipping-cost">هزینه ارسال (تومان)</Label>
          <Input
            id="shipping-cost"
            inputMode="numeric"
            dir="ltr"
            className="text-left"
            value={cost}
            onChange={(event) => setCost(event.target.value.replace(/\D/g, ""))}
            disabled={disabled || pending}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shipping-tracking">کد رهگیری (اختیاری)</Label>
          <Input
            id="shipping-tracking"
            dir="ltr"
            className="text-left"
            value={trackingCode}
            onChange={(event) => setTrackingCode(event.target.value)}
            disabled={disabled || pending}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shipping-notes">توضیح ارسال (اختیاری)</Label>
          <Input
            id="shipping-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={disabled || pending}
          />
        </div>
      </div>

      {result ? (
        <p
          className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-caption leading-5 ${
            result.ok
              ? "border border-teal-200 bg-teal-50 text-teal-800"
              : "border border-red-200 bg-red-50 text-danger"
          }`}
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <CircleExclamationPoint
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
          )}
          {result.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        className="mt-3"
        disabled={disabled || pending}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ذخیره اطلاعات ارسال
      </Button>
    </form>
  );
}
