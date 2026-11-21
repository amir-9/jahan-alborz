import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowRight, CircleExclamationPoint, Eye } from "lucide-react";
import { BlogForm, type BlogSectionInput } from "@/components/admin/blog-form";
import { Button } from "@/components/ui/button";
import { getAdminBlogPost } from "@/lib/data/admin-repository";
import { requireAdminPage } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "ویرایش مطلب",
};

/** Blog content is read from the database per request. */
export const instant = false;

type AdminEditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

function toSections(value: unknown): BlogSectionInput[] {
  if (!Array.isArray(value)) {
    return [{ heading: "", paragraphs: "" }];
  }

  const sections = value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const heading = typeof record.heading === "string" ? record.heading : "";
    const paragraphs = Array.isArray(record.paragraphs)
      ? record.paragraphs.filter(
          (paragraph): paragraph is string => typeof paragraph === "string",
        )
      : [];

    return [{ heading, paragraphs: paragraphs.join("\n") }];
  });

  return sections.length > 0 ? sections : [{ heading: "", paragraphs: "" }];
}

export default async function AdminEditBlogPostPage({
  params,
}: AdminEditBlogPostPageProps) {
  await connection();
  await requireAdminPage("content:write", "/admin/blog");

  const { id } = await params;

  let post: Awaited<ReturnType<typeof getAdminBlogPost>> = null;
  let failed = false;

  try {
    post = await getAdminBlogPost(id);
  } catch (error) {
    console.error("[admin] edit blog post query failed", error);
    failed = true;
  }

  if (!failed && !post) {
    notFound();
  }

  if (failed || !post) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-caption leading-6 text-amber-800">
        <p className="flex items-center gap-2 font-bold">
          <CircleExclamationPoint className="h-4 w-4" aria-hidden="true" />
          دریافت اطلاعات مطلب در حال حاضر ممکن نیست.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/admin/blog">بازگشت به وبلاگ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1 text-caption font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            همه مطالب
          </Link>
          <h1 className="mt-1 text-lg font-extrabold text-primary sm:text-xl">
            ویرایش مطلب
          </h1>
          <p className="mt-1 text-caption text-muted-foreground">
            آخرین ویرایش: {formatDate(post.updatedAt)}
            {post.publishedAt
              ? ` · تاریخ انتشار: ${formatDate(post.publishedAt)}`
              : ""}
          </p>
        </div>
        {post.isPublished ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              مشاهده در سایت
            </Link>
          </Button>
        ) : null}
      </div>

      <BlogForm
        initial={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt ?? "",
          category: post.category ?? "",
          readTime: String(post.readTime),
          author: post.author ?? "",
          sections: toSections(post.content),
          isPublished: post.isPublished,
        }}
      />
    </div>
  );
}
