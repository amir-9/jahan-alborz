"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Clock,
  MapPin,
  Menu,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config/site";
import type { ProductCategory } from "@/lib/data/catalog";
import { selectCartCount, useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils/cn";
import { formatNumber, toTelHref } from "@/lib/utils/format";

type HeaderViewer = {
  name?: string | null;
  role?: string | null;
} | null;

type SiteHeaderProps = {
  categories: ProductCategory[];
  viewer?: HeaderViewer;
};

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "خانه", href: "/" },
  { label: "فروشگاه", href: "/shop" },
  { label: "خدمات", href: "/services" },
  { label: "درباره ما", href: "/about" },
  { label: "وبلاگ", href: "/blog" },
  { label: "تماس با ما", href: "/contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ categories, viewer = null }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const cartCount = useCartStore(selectCartCount);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Utility bar */}
      <div className="hidden bg-primary-900 text-primary-foreground lg:block">
        <div className="page-container flex h-9 items-center justify-between text-caption">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
              {siteConfig.address.fullAddress}
            </span>
            <span className="inline-flex items-center gap-1.5 text-on-primary-muted">
              <Clock className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
              {siteConfig.business.workHours.days}،{" "}
              {siteConfig.business.workHours.hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            {viewer ? (
              <>
                <Link
                  href="/account"
                  className="max-w-40 truncate font-semibold text-on-primary-muted transition-colors hover:text-secondary"
                >
                  {viewer.name?.trim() || "حساب کاربری"}
                </Link>
                {viewer.role && viewer.role !== "CUSTOMER" ? (
                  <Link
                    href="/admin"
                    className="font-semibold text-secondary transition-colors hover:text-secondary-100"
                  >
                    پنل مدیریت
                  </Link>
                ) : null}
                <span className="h-3 w-px bg-primary-foreground/20" aria-hidden="true" />
              </>
            ) : null}
            <span className="text-on-primary-muted">
              ارسال محصولات به سراسر ایران
            </span>
            <span className="h-3 w-px bg-primary-foreground/20" aria-hidden="true" />
            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:text-secondary"
              dir="ltr"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b border-border/80 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85",
          "transition-shadow duration-300",
          isScrolled ? "shadow-header" : "",
        )}
      >
        <div className="page-container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="باز کردن منو"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="max-w-sm">
                <SheetHeader>
                  <SheetTitle>منوی سایت</SheetTitle>
                  <SheetDescription>
                    دسترسی سریع به فروشگاه، خدمات و اطلاعات تماس
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <nav aria-label="منوی موبایل">
                    <ul className="space-y-1">
                      {navItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              "block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                              isActivePath(pathname, item.href)
                                ? "bg-primary-50 text-primary"
                                : "text-foreground hover:bg-muted",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <Separator className="my-5" />

                  <p className="px-3 text-caption font-bold text-muted-foreground">
                    دسته‌بندی محصولات
                  </p>
                  <ul className="mt-2 space-y-1">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/categories/${category.slug}`}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-caption text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          {category.name}
                          <ChevronDown
                            className="h-3.5 w-3.5 -rotate-90 text-muted-foreground/60"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Separator className="my-5" />

                  <Button asChild variant="secondary" className="w-full">
                    <a href={toTelHref(siteConfig.contact.phone)}>
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      تماس با فروشگاه
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Logo withCaption={false} className="lg:gap-3" />
          </div>

          <nav aria-label="منوی اصلی" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                const isShop = item.href === "/shop";

                if (isShop) {
                  return (
                    <li key={item.href} className="group relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-caption font-semibold transition-colors",
                          active
                            ? "text-primary"
                            : "text-foreground/80 hover:text-primary",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                        <ChevronDown
                          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                          aria-hidden="true"
                        />
                      </Link>

                      <div
                        className={cn(
                          "invisible absolute start-0 top-full z-50 w-72 pt-2 opacity-0",
                          "translate-y-1 transition-[opacity,transform,visibility] duration-200",
                          "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                          "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                        )}
                      >
                        <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-lift">
                          {categories.map((category) => (
                            <Link
                              key={category.slug}
                              href={`/categories/${category.slug}`}
                              className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary-50 focus-visible:bg-primary-50 focus-visible:outline-none"
                            >
                              <span className="text-caption font-bold text-foreground">
                                {category.name}
                              </span>
                              <span className="line-clamp-1 text-caption text-muted-foreground">
                                {category.description}
                              </span>
                            </Link>
                          ))}
                          <Link
                            href="/shop"
                            className="mt-1 block rounded-xl bg-muted px-3 py-2 text-center text-caption font-bold text-primary transition-colors hover:bg-primary-100"
                          >
                            مشاهده همه محصولات
                          </Link>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "pointer-events-none absolute -bottom-1 start-3 end-3 h-0.5 rounded-full bg-secondary transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                    </li>
                  );
                }

                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center rounded-lg px-3 py-2 text-caption font-semibold transition-colors",
                        active
                          ? "text-primary"
                          : "text-foreground/80 hover:text-primary",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                    <span
                      className={cn(
                        "pointer-events-none absolute -bottom-1 start-3 end-3 h-0.5 rounded-full bg-secondary transition-opacity",
                        active ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="hidden items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary md:inline-flex"
              dir="ltr"
            >
              <Phone className="h-4 w-4 text-secondary" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>

            <Link
              href="/account"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-2 text-foreground/80 transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={viewer?.name ? `حساب کاربری ${viewer.name}` : "حساب کاربری"}
            >
              <User className="h-5 w-5" aria-hidden="true" />
              {viewer ? (
                <span className="hidden max-w-24 truncate text-caption font-semibold lg:inline">
                  {viewer.name?.trim() || "حساب من"}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/80 transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={
                hasHydrated && cartCount > 0
                  ? `سبد خرید، ${formatNumber(cartCount)} کالا`
                  : "سبد خرید"
              }
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {hasHydrated && cartCount > 0 ? (
                <span className="absolute -end-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-caption font-bold text-secondary-foreground">
                  {formatNumber(cartCount)}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
