import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/data/catalog-repository";
import { getProductMedia } from "@/lib/media/catalog-media";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate, formatNumber } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "وبلاگ",
  description:
    "مقالات و راهنماهای جهان البرز درباره انتخاب، نگهداری و تعمیر پکیج و رادیاتور.",
  path: "/blog",
});

/** Published articles are read from the database per request. */
export const instant = false;

export default async function BlogPage() {
  await connection();

  const blogPosts = await getBlogPosts();
  const [featured, ...rest] = blogPosts;

  return (
    <div className="page-shell page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "وبلاگ" }]} />

      <div className="mt-6">
        <SectionHeading
          as="h1"
          eyebrow="وبلاگ جهان البرز"
          title="راهنمای انتخاب، نگهداری و تعمیر"
          description="مطالب کوتاه و کاربردی برای اینکه انتخاب بهتری داشته باشید و تجهیزات گرمایشی را درست نگه دارید."
          action={<Badge variant="outline">راهنمای کاربردی</Badge>}
        />
      </div>

      {featured ? (
        <article className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[16rem] overflow-hidden border-b border-border bg-primary-50 lg:border-b-0 lg:border-e">
              <Image
                src={getProductMedia("boiler").src}
                alt={getProductMedia("boiler").alt}
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                <Badge variant="secondary">{featured.category}</Badge>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {formatNumber(featured.readTime)} دقیقه مطالعه
                </span>
                <span>{formatDate(featured.publishedAt)}</span>
              </div>

              <h2 className="mt-4 text-xl font-extrabold leading-8 text-primary sm:text-2xl">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="transition-colors hover:text-secondary-700 focus-visible:outline-none focus-visible:underline"
                >
                  {featured.title}
                </Link>
              </h2>

              <p className="mt-3 text-caption leading-7 text-muted-foreground">
                {featured.excerpt}
              </p>

              <div className="mt-6">
                <Button asChild>
                  <Link href={`/blog/${featured.slug}`}>
                    مطالعه مطلب
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {rest.map((post, index) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative h-44 overflow-hidden border-b border-border bg-primary-50">
              <Image
                src={getProductMedia(index === 0 ? "radiator" : "parts").src}
                alt={getProductMedia(index === 0 ? "radiator" : "parts").alt}
                fill
                sizes="(max-width: 768px) 90vw, 45vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {formatNumber(post.readTime)} دقیقه
                </span>
              </div>
              <h2 className="mt-3 text-body-sm font-bold leading-7 text-foreground transition-colors group-hover:text-primary">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-2 line-clamp-2 text-caption leading-6 text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 text-caption text-muted-foreground">
                <span>{formatDate(post.publishedAt)}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-secondary-700"
                >
                  ادامه مطلب
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-caption leading-6 text-muted-foreground">
        مطالب این بخش راهنمای عمومی هستند و جایگزین مشاوره فنی حضوری یا دفترچه
        راهنمای دستگاه نمی‌شوند.
      </p>
    </div>
  );
}
