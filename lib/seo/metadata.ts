import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path relative to the site root, used for canonical and Open Graph URLs. */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

/**
 * Builds consistent Persian metadata with canonical, Open Graph and Twitter
 * fields so every page can be shared and indexed on its own terms.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      locale: "fa_IR",
      siteName: siteConfig.name,
      url: path,
      title,
      description,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
