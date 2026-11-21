import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { getFaqs } from "@/lib/data/catalog-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toTelHref, toWhatsAppHref } from "@/lib/utils/format";

export const metadata: Metadata = buildPageMetadata({
  title: "سوالات متداول",
  description:
    "پاسخ سوالات متداول درباره ارسال محصولات، محدوده خدمات، قیمت‌گذاری، نصب و شرایط خرید از جهان البرز.",
  path: "/faq",
});

/** FAQ content is read from the database per request. */
export const instant = false;

export default async function FaqPage() {
  await connection();

  const faqs = await getFaqs();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: "سوالات متداول" }]} />
      <JsonLd data={faqSchema} />

      <div className="mt-6 max-w-2xl">
        <Badge variant="secondary">پاسخ‌های کوتاه</Badge>
        <h1 className="mt-3 text-2xl font-extrabold text-primary sm:text-3xl">
          سوالات متداول
        </h1>
        <p className="mt-3 text-caption leading-8 text-muted-foreground">
          پاسخ پرتکرارترین سوالات درباره خرید، ارسال و خدمات. اگر پاسخ سوال
          خود را پیدا نکردید، با ما تماس بگیرید.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_19rem] lg:items-start">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h2 className="text-sm font-bold text-primary">
              پاسخ سوال خود را پیدا نکردید؟
            </h2>
            <p className="mt-2 text-caption leading-6 text-muted-foreground">
              برای سوال فنی، استعلام موجودی یا هماهنگی خدمات با فروشگاه تماس
              بگیرید.
            </p>
            <div className="mt-4 space-y-2">
              <Button asChild className="w-full">
                <a href={toTelHref(siteConfig.contact.phone)} dir="ltr">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.contact.phone}
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={toWhatsAppHref(
                    siteConfig.contact.whatsapp,
                    "سلام، یک سوال درباره محصولات یا خدمات دارم.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  گفت‌وگو در واتساپ
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-muted p-5">
            <h2 className="text-caption font-bold text-primary">
              نیاز به بازدید فنی دارید؟
            </h2>
            <p className="mt-2 text-caption leading-6 text-muted-foreground">
              برای بررسی عیب دستگاه، فرم درخواست خدمات را تکمیل کنید تا برای
              هماهنگی با شما تماس بگیریم.
            </p>
            <Link
              href="/services/request"
              className="mt-3 inline-flex text-caption font-bold text-primary transition-colors hover:text-secondary-700"
            >
              ثبت درخواست خدمات ←
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
