import type { Metadata } from "next";
import { connection } from "next/server";
import { BlogForm } from "@/components/admin/blog-form";
import { requireAdminPage } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "مطلب جدید",
};

/** Creating a blog post needs the admin session per request. */
export const instant = false;

export default async function AdminNewBlogPostPage() {
  await connection();
  await requireAdminPage("content:write", "/admin/blog");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-extrabold text-primary sm:text-xl">
          ایجاد مطلب وبلاگ
        </h1>
        <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
          نامک یکتا است و آدرس صفحه مطلب را می‌سازد. مطلب را می‌توانید ابتدا به
          صورت پیش‌نویس ذخیره کنید و سپس منتشر کنید.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
