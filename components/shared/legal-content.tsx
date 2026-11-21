import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/lib/config/site";
import { toTelHref, toWhatsAppHref } from "@/lib/utils/format";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

type LegalContentProps = {
  title: string;
  lead: string;
  sections: LegalSection[];
};

/** Shared layout for the store's terms and privacy documents. */
export function LegalContent({ title, lead, sections }: LegalContentProps) {
  return (
    <div className="page-container pb-16 pt-6 sm:pt-8">
      <Breadcrumbs items={[{ name: title }]} />

      <header className="mt-6 max-w-3xl">
        <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">{title}</h1>
        <p className="mt-3 text-caption leading-8 text-muted-foreground">{lead}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6"
            >
              <h2 className="text-sm font-extrabold text-foreground sm:text-base">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-caption leading-8 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              {section.items?.length ? (
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-caption leading-7 text-muted-foreground"
                    >
                      <span
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-primary-50/60 p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-extrabold text-primary">پرسش یا درخواست؟</h2>
          <p className="mt-2 text-caption leading-7 text-muted-foreground">
            برای پرسش درباره این صفحه یا درخواست حذف اطلاعات، از راههای
            زیر با فروشگاه تماس بگیرید.
          </p>
          <div className="mt-4 space-y-2.5 text-caption">
            <a
              href={toTelHref(siteConfig.contact.phone)}
              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
              dir="ltr"
            >
              <Phone className="h-4 w-4 text-secondary" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
            <a
              href={toWhatsAppHref(siteConfig.contact.whatsapp)}
              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
              dir="ltr"
            >
              <MessageCircle className="h-4 w-4 text-secondary" aria-hidden="true" />
              {siteConfig.contact.whatsapp}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
              dir="ltr"
            >
              <Mail className="h-4 w-4 text-secondary" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline"
          >
            صفحه تماس با ما
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
