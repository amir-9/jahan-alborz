# جهان البرز — فروشگاه و خدمات تجهیزات گرمایشی

Production-oriented Persian (RTL) storefront and service site for **جهان البرز** in Qazvin.

- **Framework:** Next.js 16 (App Router, Cache Components, Partial Prefetching)
- **Language:** TypeScript (strict), no `any`
- **UI:** Tailwind CSS v4, shadcn-style primitives, Lucide icons, Motion
- **Data:** PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- **Auth:** Auth.js v4 (Credentials: customer OTP, customer password, staff email/password)
- **State:** Zustand (cart, persisted), TanStack Query, React Hook Form + Zod
- **SEO:** per-page metadata, canonical URLs, OG/Twitter, sitemap, robots, JSON-LD

---

## 1. Requirements

- Node.js 20.9+ (Node 22 recommended)
- PostgreSQL 14+
- npm 10+

## 2. Local setup

```bash
# 1) Install dependencies (also runs `prisma generate`)
npm install

# 2) Create env files
cp .env.example .env.local
# Then edit .env.local and fill in DATABASE_URL, NEXTAUTH_SECRET, ...

# 3) Start a local PostgreSQL if you don't have one.
#    Prisma has a local dev server that prints a connection string:
npx prisma dev --name jahan-alborz --detach

# 4) Apply migrations and seed demo content
npm run db:deploy      # or: npm run db:migrate
npm run db:seed

# 5) Start the app
npm run dev
```

Open <http://localhost:3000>.

> The seed script is idempotent. It creates 4 categories, 12 demo products,
> 3 blog posts, 8 FAQs, site settings, and — only when all three
> `SEED_ADMIN_*` variables are set — the first `SUPER_ADMIN`.

### Demo data is labelled

Products, articles, FAQ entries and testimonials shipped by the seed are
illustrative. The public catalog shows a visible demo notice when it falls back
to in-memory data because the database is missing or unreachable. Orders and
service requests **never** fall back: without a database they fail honestly.

## 3. Environment variables

All variables are documented in `.env.example`. Summary:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string (`sslmode=require` on hosted providers) |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin used by metadata, OG, sitemap |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL` | yes | Centralized contact info (`lib/config/site.ts`) |
| `NEXTAUTH_URL` | yes | Public origin of the app |
| `NEXTAUTH_SECRET` | yes | Auth.js JWT/session signing secret |
| `ORDER_ACCESS_SECRET` | recommended | HMAC key for guest order-access cookies (falls back to `NEXTAUTH_SECRET`) |
| `SMS_PROVIDER` | yes | `mock` (development only) or `kavenegar` |
| `KAVENEGAR_API_KEY`, `KAVENEGAR_SENDER`, `KAVENEGAR_TEMPLATE` | when Kavenegar | OTP delivery and order notifications |
| `ADMIN_ORDER_NOTIFY_PHONE` | no | Phone that receives a text alert for each new order (empty disables the admin alert) |
| `PAYMENT_PROVIDER` | yes | `manual` — no online gateway is bundled |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PHONE`, `SEED_ADMIN_PASSWORD` | seeding only | Creates/rotates the first `SUPER_ADMIN` |

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use a **different** value for `NEXTAUTH_SECRET` and `ORDER_ACCESS_SECRET`.

## 4. Database deployment (Vercel)

Any standard PostgreSQL works: Vercel Postgres, Neon, Supabase, Prisma Postgres,
or a self-hosted instance reachable over TLS.

1. Provision the database and copy its pooled connection string.
2. Add `DATABASE_URL` to the Vercel project (Production and Preview).
3. Run migrations against production from your machine (or a CI step):

   ```bash
   DATABASE_URL="postgresql://..." npm run db:deploy
   ```

4. Seed once, if you want the starter catalog/FAQ/blog:

   ```bash
   DATABASE_URL="postgresql://..." \
   SEED_ADMIN_EMAIL="admin@your-domain.ir" \
   SEED_ADMIN_PHONE="+98912xxxxxxx" \
   SEED_ADMIN_PASSWORD="a-strong-unique-password" \
   npm run db:seed
   ```

5. Delete `SEED_ADMIN_PASSWORD` from the environment afterwards.
   Re-running the seed with it set **resets that admin password**.

> `prisma migrate deploy` is the production command. Do not run
> `prisma migrate dev` against production.

## 5. Deploy to Vercel

1. Push the repository to GitHub/GitLab.
2. Import the project in Vercel. Framework preset: **Next.js**.
3. Build command: `npm run build` (default). Install command: `npm install`
   (`postinstall` runs `prisma generate`).
4. Add every variable from section 3 to Production (and Preview if needed).
5. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
6. Deploy. Then run migrations (step 4.3) if you have not already.
7. Sign in at `/auth/login` → tab **ورود کارکنان** with the seeded admin.

### Post-deploy smoke check

- `/` loads with real contact info and no demo banner.
- `/shop`, a product page, `/blog`, `/faq`, `/terms`, `/privacy` load correctly.
- Sharing the site shows the generated Open Graph image; the browser tab shows
  the SVG icon.
- Customer OTP login delivers a real SMS (Kavenegar configured).
- Guest checkout: mobile verification → order created → confirmation page.
- Admin: dashboard, orders, services, products, categories, blog, FAQ, users.

## 6. Auth and roles

- Customers: mobile + OTP, or mobile + password.
- Staff: email + password (rate limited: 10 attempts / 15 minutes per identity).
- Roles: `CUSTOMER`, `SUPER_ADMIN`, `ADMIN`, `PRODUCT_MANAGER`,
  `ORDER_MANAGER`, `CONTENT_MANAGER`, `SERVICE_MANAGER`.
- Permissions live in `lib/auth/permissions.ts`. Pages use
  `requireAdminPage(permission)`; server actions use
  `getAdminActionUser(permission)` and return an honest error instead of
  redirecting.
- Role changes are stored in the database but reach the JWT session on the
  user's **next login**. The UI says so explicitly.
- The last active `SUPER_ADMIN` cannot be demoted or deactivated, and nobody
  can change their own role/active state.

### OTP behaviour

- Codes are stored as SHA-256 hashes with expiry and attempt limits.
- Rate limiting is database-backed (fixed window).
- `SMS_PROVIDER=mock` logs the code to the server console and **throws in
  production**, so a misconfigured deployment fails loudly instead of silently.
- Guest checkout requires a recently verified `checkout` OTP. The client cannot
  assert verification by itself.

## 7. Orders, payments and inventory

- Guest order access uses an HMAC-signed `ja_order_<orderNumber>` httpOnly
  cookie (7 days) plus user ownership checks for logged-in customers.
- Online orders are created as `AWAITING_PAYMENT` with an explicit
  “gateway not enabled / not paid” message. COD orders start as `PENDING`.
- No order can be marked `PAID` without an administrator explicitly recording
  the payment; there is no fake gateway and no fake confirmation.
- Inventory is decremented inside the order transaction with a guarded
  `updateMany`. Cancelling an order restocks it; cancelled orders cannot reopen.
- Editing cost fields is blocked once an order is marked `PAID`.
- Products are soft-deleted (`isActive: false`) so order history stays intact.

### SMS notifications

- On a **new** order, the customer receives a text confirming the order number
  and explaining that stock and shipping are checked before fulfilment. If
  `ADMIN_ORDER_NOTIFY_PHONE` is set, the same event also alerts that number.
- `lib/orders/notifications.ts` uses the existing `lib/sms/sms.ts` abstraction;
  Kavenegar uses the plain `/sms/send.json` endpoint for these messages.
- Delivery is **best effort**: a failed SMS never rolls back or fails an order
  that was already committed. Failures are logged with `[orders] notification`.
- With `SMS_PROVIDER=mock`, messages are printed to the server console in
  development and the provider throws in production, so a misconfigured
  deployment cannot silently pretend to send SMS.

### Connecting a real payment gateway

`lib/payments/payment-provider.ts` defines `PaymentProvider`
(`initiate` → `manual` | `redirect`). To add Zarinpal or another Iranian PSP:

1. Implement the provider with initiation + a **verified** callback.
2. Only mark an order `PAID` inside the verified callback, never on the return
   URL alone.
3. Set `PAYMENT_PROVIDER` and add its credentials to the environment.

Until then, keep `PAYMENT_PROVIDER=manual`.

## 8. Admin content management

- **Products / categories:** create, edit, activate/hide, stock, pricing,
  quote-only products. Product visuals are generated SVG schematics.
- **Orders:** status transitions, payment recording, shipping cost/method.
- **Service requests:** status, assignment, internal notes.
- **Blog:** create/edit posts as heading + paragraph sections, save as draft,
  publish/unpublish. Published posts appear at `/blog`.
- **FAQ:** create/edit, reorder, show/hide. Active entries feed `/faq` and its
  `FAQPage` structured data.

## 9. Project structure

```
app/(public)        Public storefront, cart, checkout, account
app/admin           Admin shell and pages
app/(auth)          Login / register
app/api/auth        Auth.js route handler
components/         UI, layout, shared, admin components
lib/actions         Server actions (validation + authorization)
lib/auth            Auth.js options, session guards, permissions, OTP, hashing
lib/data            Public + admin read repositories
lib/generated       Generated Prisma client (do not edit)
lib/payments        Payment provider abstraction
lib/sms             SMS provider abstraction
lib/security        Database-backed rate limiting
prisma              Schema, migrations, seed
```

## 10. Quality gates

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

All four must pass before deploying.

### Unit tests

`tests/` contains Vitest unit tests for the critical pure modules: phone
normalization, checkout validation, role permissions, signed order-access
cookies, payment-provider honesty, and best-effort SMS notifications. Async
Server Components are not supported by Vitest, so the end-to-end flows (OTP
login, guest checkout, admin actions) are verified manually in the browser.

Use `npm run test:watch` while developing.

## 11. Honest limitations

These are intentional for this version; do not describe them as finished:

- **No online payment gateway.** Orders remain unpaid until an admin records a
  payment. A real PSP must be implemented and verified before claiming online
  payment.
- **No media upload.** Product images are schematic SVGs; there is no image
  upload/CDN admin.
- **Homepage/About/contact are not editable in the admin panel.** Contact data
  is environment-driven and centralized in `lib/config/site.ts`.
- **Customer reviews are demo content**, not a moderated review system.
- **No analytics dashboard.** The `AnalyticsEvent` model exists, but no event
  ingestion/UI is wired up.
- **No automated transactional email** (e.g. staff password delivery, order
  emails).
- **Role changes require re-login** because Auth.js v4 JWT sessions embed the
  role.

## 12. Troubleshooting

- **`DATABASE_URL is required`** — env file missing or not loaded. Confirm
  `.env.local` exists locally and the variable is set in Vercel.
- **Public pages show a demo banner** — the database is missing/unreachable;
  the catalog fell back to labelled demo data. Orders will not fall back.
- **OTP never arrives** — in development read the code from the server console
  (`SMS_PROVIDER=mock`). In production configure Kavenegar and check its
  dashboard; the mock provider refuses to run in production.
- **Prisma client errors after schema changes** — run `npm run db:generate`.
- **`PrismaClientInitializationError` on Vercel** — the connection string is
  wrong, TLS is required, or the provider needs a pooler URL. Follow the
  provider's Prisma guidance.
- **502 / blank page after adding routes** — restart `npm run dev`; the dev
  server may have stopped while compiling.
