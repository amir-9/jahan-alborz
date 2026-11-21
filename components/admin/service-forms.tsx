"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  MessageSquarePlus,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addServiceNote, updateServiceStatus } from "@/lib/actions/admin-services";
import { serviceStatusOptions } from "@/lib/constants/status";

type Result = { ok: true; message: string } | { ok: false; message: string } | null;

type ServiceStatusFormProps = {
  requestId: string;
  currentStatus: string;
  currentAssignee: string;
};

export function ServiceStatusForm({
  requestId,
  currentStatus,
  currentAssignee,
}: ServiceStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [assignedTo, setAssignedTo] = useState(currentAssignee);
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await updateServiceStatus({
        requestId,
        status,
        assignedTo,
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
      <h2 className="text-sm font-bold text-primary">وضعیت درخواست</h2>
      <p className="mt-1 text-caption leading-5 text-muted-foreground">
        وضعیت جدید و تکنسین مسئول را ثبت کنید. هر تغییر در یادداشت‌های داخلی
        درخواست ثبت می‌شود.
      </p>

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="service-status">وضعیت</Label>
          <Select
            id="service-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={pending}
          >
            {serviceStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="service-assignee">تکنسین / مسئول (اختیاری)</Label>
          <Input
            id="service-assignee"
            value={assignedTo}
            maxLength={80}
            placeholder="نام تکنسین یا واحد مسئول"
            onChange={(event) => setAssignedTo(event.target.value)}
            disabled={pending}
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
        disabled={pending || (status === currentStatus && assignedTo === currentAssignee)}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ذخیره وضعیت
      </Button>
    </form>
  );
}

export function ServiceNoteForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await addServiceNote({ requestId, note });
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
      <h2 className="text-sm font-bold text-primary">یادداشت داخلی</h2>
      <p className="mt-1 text-caption leading-5 text-muted-foreground">
        این یادداشت فقط برای کارکنان است و به مشتری نمایش داده نمی‌شود.
      </p>

      <div className="mt-3 flex flex-col gap-1.5">
        <Label htmlFor="service-note">متن یادداشت</Label>
        <Textarea
          id="service-note"
          rows={3}
          maxLength={1000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="نتیجه تماس، زمان مراجعه یا نکات فنی"
          disabled={pending}
        />
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
        disabled={pending || note.trim().length === 0}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ثبت یادداشت
      </Button>
    </form>
  );
}
