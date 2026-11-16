import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/app-providers";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig, siteMetadata } from "@/lib/config/site";
import { getLocalBusinessSchema } from "@/lib/seo/structured-data";
import "./globals.css";

const vazirmatn = localFont({
  src: [
    {
      path: "../public/fonts/Vazirmatn.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "Segoe UI", "sans-serif"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteMetadata.title.default,
    template: siteMetadata.title.template,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: siteMetadata.title.default,
    description: siteMetadata.description,
  },
  twitter: {
    card: "summary",
    title: siteMetadata.title.default,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#142d4e",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
        <JsonLd data={getLocalBusinessSchema()} />
      </body>
    </html>
  );
}
