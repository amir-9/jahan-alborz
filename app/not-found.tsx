import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <Logo className="mb-8" />

        <p className="text-[6rem] font-extrabold leading-none text-primary/10">
          ۴۰۴
        </p>
        <h1 className="-mt-4 text-xl font-extrabold text-primary sm:text-2xl">
          این صفحه پیدا نشد
        </h1>
        <p className="mt-3 text-[12.5px] leading-7 text-muted-foreground">
          ممکن است آدرس تغییر کرده باشد یا محصول مورد نظر از فروشگاه حذف شده
          باشد. از مسیرهای زیر ادامه دهید.
        </p>

        <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              صفحه اصلی
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/shop">
              <Search className="h-4 w-4" aria-hidden="true" />
              جست‌وجو در فروشگاه
            </Link>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
          {[
            { label: "خدمات", href: "/services" },
            { label: "وبلاگ", href: "/blog" },
            { label: "تماس با ما", href: "/contact" },
            { label: "سوالات متداول", href: "/faq" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              {item.label}
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
