import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/catalog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  return {
    title: post?.title ?? "مقاله",
    description: post?.excerpt ?? "مقاله آموزشی گرمایشی",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary">
              خانه
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/blog" className="hover:text-primary">
              وبلاگ
            </Link>
          </li>
        </ol>
      </nav>

      <article className="mt-8">
        <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {post.readTime} دقیقه مطالعه
        </p>
        <p className="mt-6 text-base leading-9 text-foreground">
          {post.excerpt} مطالب این مقاله به‌صورت نمونه اولیه در این مرحله از
          طراحی سایت آماده شده است و به‌زودی با محتوای کامل‌تر به‌روزرسانی
          خواهد شد.
        </p>
      </article>
    </div>
  );
}
