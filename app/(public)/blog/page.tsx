import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "آموزش‌های گرمایشی و نکات تعمیر و نگهداری.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        آموزش‌های گرمایشی
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href="/blog"
            className="rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {post.excerpt}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {post.readTime} دقیقه مطالعه
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
