import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { CircleExclamationPoint, Newspaper, Plus } from "lucide-react";
import { BlogRowActions } from "@/components/admin/blog-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminBlogPosts } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import { formatDate, formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "وبلاگ",
};

/** Blog content is read from the database per request. */
export const instant = false;

export default async function AdminBlogPage() {
  await connection();
  await requireAdminPage("content:write", "/admin/blog");

  let posts: Awaited<ReturnType<typeof getAdminBlogPosts>> | null = null;

  try {
    posts = await getAdminBlogPosts();
  } catch (error) {
    console.error("[admin] blog query failed", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-primary sm:text-xl">
            مدیریت وبلاگ
          </h1>
          <p className="mt-1.5 text-caption leading-6 text-muted-foreground">
            مطالب منتشرشده در وبلاگ عمومی نمایش داده می‌شوند. هر مطلب از بخش‌های
            عنوان‌دار و پاراگراف تشکیل می‌شود.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            مطلب جدید
          </Link>
        </Button>
      </div>

      {!posts ? (
        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-caption leading-6 text-amber-800">
          <CircleExclamationPoint
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          دریافت مطالب در حال حاضر ممکن نیست. اتصال پایگاه داده را بررسی کنید.
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Newspaper className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-caption font-bold text-primary">
            هنوز مطلبی ثبت نشده است
          </p>
          <p className="mt-1.5 text-caption text-muted-foreground">
            نخستین مطلب وبلاگ را ایجاد کنید.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-caption font-bold text-primary hover:underline"
                    >
                      {post.title}
                    </Link>
                    <Badge variant={post.isPublished ? "success" : "outline"}>
                      {post.isPublished ? "منتشر شده" : "پیش‌نویس"}
                    </Badge>
                    {post.category ? (
                      <Badge variant="secondary">{post.category}</Badge>
                    ) : null}
                  </div>

                  <p className="mt-1 break-words text-caption text-muted-foreground [overflow-wrap:anywhere]">
                    <span dir="ltr">{post.slug}</span>
                    {` · ${formatNumber(post.readTime)} دقیقه مطالعه`}
                    {post.publishedAt
                      ? ` · انتشار: ${formatDate(post.publishedAt)}`
                      : " · بدون تاریخ انتشار"}
                    {` · آخرین ویرایش: ${formatDate(post.updatedAt)}`}
                  </p>

                  <p className="mt-1.5 line-clamp-2 break-words text-caption leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                    {post.excerpt}
                  </p>
                </div>

                <BlogRowActions
                  postId={post.id}
                  isPublished={post.isPublished}
                />
              </div>
            </article>
          ))}

          <p className="text-caption text-muted-foreground">
            مجموع {formatNumber(posts.length)} مطلب ثبت شده است.
          </p>
        </div>
      )}
    </div>
  );
}
