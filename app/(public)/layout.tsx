import { connection } from "next/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingContact } from "@/components/layout/floating-contact";
import { CartSheet } from "@/components/shop/cart-sheet";
import { getCategories } from "@/lib/data/catalog-repository";
import { getSession, toSessionUser } from "@/lib/auth/session";

/**
 * The public shell reads the catalog and the session per request so that
 * prices, stock levels, navigation categories and the account area always
 * reflect the database instead of a build-time snapshot.
 */
export const instant = false;

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  await connection();

  const [categories, session] = await Promise.all([
    getCategories(),
    getSession(),
  ]);
  const user = toSessionUser(session);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        categories={categories}
        viewer={user ? { name: user.name, role: user.role } : null}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
      <CartSheet />
      <FloatingContact />
    </div>
  );
}
