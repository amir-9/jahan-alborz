import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, Clock, Phone, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config/site";
import {
  getBlogPostBySlug,
  getBlogPosts,
} from "@/lib/data/catalog-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate, formatNumber, toTelHref } from "@/lib/utils/format";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

/** Article content is read from the database per request. */
export const instant = false;

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "مطلب یافت نشد" };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connection();

  const { slug } = await params;
  const [post, blogPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const related = blogPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "fa-IR",
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <div className="page-shell page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { name: "وبلاگ", href: "/blog" },
          { name: post.title },
        ]}
      />
      <JsonLd data={articleSchema} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_19rem] lg:items-start">
        <article className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-9">
          <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNumber(post.readTime)} دقیقه مطالعه
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-[1.6] text-primary sm:text-[1.9rem]">
            {post.title}
          </h1>

          <p className="mt-4 rounded-xl border-s-2 border-secondary bg-secondary-50/60 px-4 py-3 text-caption leading-7 text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-8 space-y-7">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-base font-bold text-primary">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-caption leading-8 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="rounded-xl border border-dashed border-border bg-surface-muted px-4 py-3 text-caption leading-6 text-muted-foreground">
            این مطلب راهنمای عمومی است. برای تشخیص دقیق عیب دستگاه یا انتخاب
            ظرفیت، از مشاوره فنی استفاده کنید و به دفترچه راهنمای محصول مراجعه
            کنید.
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild>
              <Link href="/services/request">درخواست بازدید فنی</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {siteConfig.contact.phone}
              </a>
            </Button>
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="text-sm font-bold text-primary">مطالب مرتبط</h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group block rounded-xl border border-border p-3 transition-colors hover:border-primary/25 hover:bg-primary-50/40"
                  >
                    <p className="text-caption font-bold leading-6 text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {formatNumber(item.readTime)} دقیقه مطالعه
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-1.5 text-caption font-bold text-primary transition-colors hover:text-secondary-700"
            >
              همه مقالات
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-primary-900 p-5 text-primary-foreground shadow-soft">
            <ShieldCheck className="h-6 w-6 text-secondary" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-bold">مشاوره پیش از اقدام</h2>
            <p className="mt-2 text-caption leading-6 text-on-primary-muted">
              برای اطمینان از تشخیص و انتخاب قطعه، پیش از خرید یا تعمیر با
              کارشناس ما هماهنگ کنید.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
              <Link href="/services/request">ثبت درخواست</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
