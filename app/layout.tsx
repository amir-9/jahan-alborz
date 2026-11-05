import type { Metadata } from "next";
import { siteConfig, siteMetadata } from "@/lib/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteMetadata.title.default,
    template: siteMetadata.title.template,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
