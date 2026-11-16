"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleExclamationPoint,
  LoaderCircle,
  Save,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  createStaffUser,
  setUserActive,
  updateUserRole,
} from "@/lib/actions/admin-users";
import { allRoleOptions, roleDescription, staffRoleOptions } from "@/lib/constants/roles";
import type { UserRole } from "@/lib/generated/prisma/enums";

type Result = { ok: true; message: string } | { ok: false; message: string } | null;

type UserRowActionsProps = {
  userId: string;
  role: UserRole;
  isActive: boolean;
  isSelf: boolean;
};

export function UserRowActions({
  userId,
  role,
  isActive,
  isSelf,
}: UserRowActionsProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function handleRoleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await updateUserRole({ userId, role: selectedRole });
      setResult(response);

      if (response.ok) {
        router.refresh();
      }
    });
  }

  function handleToggleActive() {
    setResult(null);

    startTransition(async () => {
      const response = await setUserActive({ userId, isActive: !isActive });
      setResult(response);

      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-border/70 bg-surface-muted/60 p-2.5">
      <div className="flex flex-wrap items-end gap-2">
        <form
          onSubmit={handleRoleSubmit}
          className="flex flex-1 flex-wrap items-end gap-1.5"
        >
          <label className="flex min-w-[9rem] flex-1 flex-col gap-1">
            <span className="text-[9.5px] font-semibold text-muted-foreground">
              نقش کاربر
            </span>
            <Select
              value={selectedRole}
              onChange={(event) => {
                setSelectedRole(event.target.value as UserRole);
                setResult(null);
              }}
              disabled={pending || isSelf}
              aria-label="نقش کاربر"
            >
              {allRoleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={pending || isSelf || selectedRole === role}
          >
            {pending ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            ثبت نقش
          </Button>
        </form>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleToggleActive}
          disabled={pending || isSelf}
          className={isActive ? "" : "text-teal-700 hover:text-teal-800"}
        >
          {pending ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : null}
          {isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
        </Button>
      </div>

      {isSelf ? (
        <p className="text-[9.5px] leading-4 text-muted-foreground">
          این حساب خود شماست؛ تغییر نقش یا غیرفعال‌سازی آن برای جلوگیری از قفل‌شدن
          دسترسی مسدود است.
        </p>
      ) : (
        <p className="text-[9.5px] leading-4 text-muted-foreground">
          {roleDescription(selectedRole)}
        </p>
      )}

      {result ? (
        <p
          className={`flex items-start gap-1.5 rounded-lg px-2 py-1.5 text-[9.5px] leading-4 ${
            result.ok ? "text-teal-700" : "text-danger"
          }`}
          role={result.ok ? "status" : "alert"}
        >
          {result.ok ? (
            <CircleCheck className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <CircleExclamationPoint
              className="mt-0.5 h-3 w-3 shrink-0"
              aria-hidden="true"
            />
          )}
          {result.message}
        </p>
      ) : null}
    </div>
  );
}

export function CreateStaffForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("ADMIN");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await createStaffUser({
        name,
        email,
        phone,
        role,
        password,
      });

      setResult(response);

      if (response.ok) {
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
    >
      <h2 className="flex items-center gap-2 text-sm font-bold text-primary">
        <UserPlus className="h-4 w-4 text-secondary" aria-hidden="true" />
        ایجاد حساب کارمند
      </h2>
      <p className="mt-1 text-[10.5px] leading-5 text-muted-foreground">
        کارکنان با ایمیل و رمز عبور وارد می‌شوند. رمز عبور را پس از ایجاد، از
        طریق کانال امن به کارمند اطلاع دهید؛ امکان ارسال خودکار ایمیل در این نسخه
        فعال نیست.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="staff-name">نام و نام خانوادگی</Label>
          <Input
            id="staff-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="staff-email">ایمیل</Label>
          <Input
            id="staff-email"
            type="email"
            dir="ltr"
            className="text-left"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="staff-phone">شماره موبایل</Label>
          <Input
            id="staff-phone"
            dir="ltr"
            inputMode="tel"
            className="text-left"
            placeholder="09xxxxxxxxx"
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/[^\d]/g, ""))}
            maxLength={11}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="staff-role">نقش</Label>
          <Select
            id="staff-role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            {staffRoleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="staff-password">رمز عبور موقت</Label>
          <Input
            id="staff-password"
            type="password"
            dir="ltr"
            className="text-left"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={10}
            maxLength={72}
            required
          />
          <p className="text-[10px] leading-5 text-muted-foreground">
            حداقل ۱۰ کاراکتر، شامل حرف انگلیسی و رقم. رمز به‌صورت هش ذخیره می‌شود.
          </p>
        </div>
      </div>

      {result ? (
        <p
          className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-2 text-[10.5px] leading-5 ${
            result.ok
              ? "border-teal-200 bg-teal-50 text-teal-800"
              : "border-red-200 bg-red-50 text-danger"
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
        disabled={
          pending ||
          name.trim().length < 2 ||
          !email.includes("@") ||
          phone.length !== 11 ||
          password.length < 10
        }
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        ایجاد حساب
      </Button>
    </form>
  );
}
