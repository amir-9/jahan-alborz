# Project: Jahan Alborz — Professional Heating Equipment & Services Website

You are a senior full-stack developer, software architect, and UI/UX designer. Your task is to design and implement a professional, production-ready Persian website for a heating equipment business called "Jahan Alborz" (جهان البرز).

You have access to the existing project files. Do not assume the project is empty. Inspect the existing codebase, understand its current configuration, and build upon it without unnecessarily deleting or replacing existing files.

All explanations, progress reports, and questions to the user must be in Persian. All code, variable names, component names, function names, and code comments must be in English.

---

# 1. Business Overview

Business name: جهان البرز (Jahan Alborz)

Business type:

- Heating equipment sales.
- Boiler and radiator sales.
- Boiler repair and maintenance.
- Heating equipment installation and servicing.

Business information:

- Physical store: Qazvin, Daneshgah Street, Iran.
- Repair and maintenance coverage: Qazvin.
- Product sales coverage: Nationwide across Iran.
- Business experience: Approximately 1–2 years.
- Logo: Not available yet.

The website must clearly distinguish between nationwide product sales and local repair services in Qazvin.

Use configurable placeholder contact information. Never invent a real phone number or a working WhatsApp number. Store all contact information in one centralized configuration file so it can easily be updated later.

---

# 2. Technical Stack

Use the following technologies and architecture:

- Next.js App Router.
- TypeScript with strict mode.
- Tailwind CSS.
- shadcn/ui for reusable UI components.
- Lucide React for icons.
- Motion (Framer Motion) for animations.
- PostgreSQL as the database.
- Prisma ORM.
- Auth.js for authentication.
- Zustand for client-side state management.
- TanStack Query for client-side server state where appropriate.
- React Hook Form.
- Zod for validation.
- Axios when appropriate for client-side API requests.

Important:

- Prefer Server Components by default.
- Use Client Components only when interactivity is required.
- Use Server Actions or Route Handlers appropriately.
- Avoid unnecessary API layers and client-side data fetching.
- Keep business logic separate from UI components.
- Do not use TypeScript `any`.
- Avoid unnecessary dependencies.
- Use clean, maintainable, scalable code.

Before installing or upgrading packages, inspect the existing package.json and installed versions. Preserve compatible existing dependencies and do not perform unnecessary major upgrades.

---

# 3. Architecture

Build the public website, customer dashboard, and admin dashboard inside the same Next.js application.

Use clearly separated route groups and layouts.

Suggested architecture:

src/
app/
(public)/
page.tsx
shop/
products/
categories/
services/
about/
contact/
blog/
cart/
checkout/
track-order/
faq/

    (auth)/
      login/
      register/
      verify-otp/
      forgot-password/

    (customer)/
      profile/
      orders/
      service-requests/
      addresses/

    admin/
      login/
      dashboard/
      products/
      categories/
      orders/
      service-requests/
      customers/
      reviews/
      content/
      blog/
      media/
      analytics/
      administrators/
      settings/

components/
ui/
layout/
public/
shop/
services/
customer/
admin/
shared/

lib/
auth/
db/
validations/
utils/
permissions/
payments/
sms/
shipping/
seo/

services/
hooks/
stores/
types/
config/

prisma/
schema.prisma
seed.ts

public/
images/
fonts/

This is a suggested structure. Adapt it when necessary to follow modern Next.js App Router conventions.

Do not create unnecessary abstraction layers or excessively split small components.

---

# 4. Visual Design and UI/UX

Create a premium, modern, minimalist corporate design.

The website must feel like a professional heating equipment brand, not a generic template or an ordinary marketplace.

Visual direction:

- Primary color: Deep navy blue.
- Secondary color: Warm orange.
- Background: White and very light gray.
- Text: Dark charcoal.
- Use subtle shadows, refined borders, generous spacing, and consistent border radii.

Suggested colors:

Primary: #142D4E
Secondary: #F28C28
Background: #F5F7FA
Surface: #FFFFFF
Text: #263445

The design must be:

- Fully Persian.
- RTL throughout the entire website.
- Fully responsive.
- Mobile-first.
- Visually consistent.
- Accessible.
- Fast and lightweight.

Typography:

- Use a locally hosted Persian font.
- Prefer a high-quality font such as IRANYekanX or a similar locally available alternative.
- Do not rely on Google Fonts at runtime.

Design requirements:

- Professional desktop navigation.
- Mobile navigation with a well-designed menu.
- Consistent buttons, forms, cards, dialogs, and tables.
- Meaningful empty states.
- Loading skeletons.
- Error states.
- Success and failure notifications.
- Smooth and subtle animations.
- Accessible keyboard interactions.

Avoid:

- Excessive gradients.
- Excessive animations.
- Generic dashboard templates.
- Overcrowded layouts.
- Unnecessary decorative elements.
- Huge headings that damage mobile responsiveness.

Use realistic, high-quality images related to boilers, radiators, heating equipment, and maintenance services.

Images must be locally available or stored in a configurable storage system. Do not make essential website functionality dependent on unreliable external image URLs.

All images must be replaceable through the admin panel.

---

# 5. Public Website Pages

Implement the following pages.

## Homepage

Create a polished landing page with these sections:

1. Professional header and navigation.
2. Hero section introducing Jahan Alborz.
3. Main call-to-action buttons:
   - Explore Products
   - Request Repair Service
4. Business advantages and trust indicators.
5. Product categories.
6. Featured products.
7. Best-selling products.
8. Heating and boiler repair services.
9. Why choose Jahan Alborz?
10. How to request a repair service.
11. Customer reviews.
12. Latest educational articles.
13. Store location and contact information.
14. Professional footer.

Use realistic Persian content. Do not claim certifications, official dealership status, customer counts, or warranties unless explicitly provided.

## Shop

Create a complete product catalog with:

- Product search.
- Category filters.
- Price filters.
- Availability filters.
- Sorting.
- Pagination.
- Responsive product cards.

Product categories:

- پکیج
- رادیاتور
- قطعات و لوازم یدکی
- لوازم نصب و اتصالات

## Product Details

Each product must support:

- Product name.
- Slug.
- Description.
- Product images and gallery.
- Category.
- Brand.
- SKU.
- Price.
- Discounted price.
- Inventory.
- Product specifications.
- Availability status.
- Customer reviews.
- Related products.
- SEO metadata.

Important business rule:

Products must support two purchasing modes:

1. Fixed-price products:
   - Display price.
   - Add to cart.
   - Checkout.

2. Quote-based products:
   - Hide the fixed price.
   - Display an inquiry button.
   - Allow customers to request pricing or contact the store.

The admin must be able to configure the purchasing mode for each product.

## Other Public Pages

Implement:

- About Us.
- Contact Us.
- Services.
- Service Request.
- Shopping Cart.
- Checkout.
- Order Tracking.
- Blog.
- Blog Article Details.
- FAQ.
- Product Categories.

Use appropriate Persian content and consistent design.

---

# 6. Repair and Maintenance Services

Available services:

- تعمیر پکیج
- سرویس دوره‌ای پکیج
- نصب پکیج و رادیاتور
- رسوب‌زدایی و اسیدشویی
- عیب‌یابی و بازدید

Repair service coverage is limited to Qazvin.

Customers must be able to submit a service request through a form.

The form should include:

- Full name.
- Mobile number.
- Service type.
- City and address.
- Boiler or equipment brand (optional).
- Problem description.
- Preferred visit date.
- Additional notes.

Allow users to contact the business by phone or WhatsApp as well.

All contact information must be configurable.

Service requests must be saved in PostgreSQL and manageable from the admin dashboard.

Implement service request statuses:

- Pending
- Confirmed
- Assigned
- In Progress
- Completed
- Cancelled

Provide customer-facing Persian status labels.

---

# 7. Shopping Cart and Checkout

Implement a complete shopping cart.

Requirements:

- Add and remove products.
- Update quantities.
- Display subtotal.
- Handle discounts.
- Validate stock availability.
- Persist guest cart using local storage.
- Support authenticated users.
- Merge guest cart when a user signs in, when appropriate.

Guest checkout must be supported.

However, guest checkout requires mobile number verification using OTP.

Checkout fields:

- Customer name.
- Mobile number.
- Delivery address.
- Postal code.
- City.
- Shipping method.
- Additional notes.

Payment methods:

- Online payment.
- Cash on delivery.

Important:

Zarinpal integration is planned for a future phase. Prepare a clean payment-provider abstraction, but do not pretend a real payment gateway is working without actual credentials and integration.

Never mark an order as paid without verified payment confirmation.

Use proper database transactions when creating orders and modifying inventory.

---

# 8. Shipping System

Support multiple shipping methods:

- Post.
- Tipax.
- Freight transport.
- Local motorcycle delivery in Qazvin.

Shipping costs should initially be determined manually by the admin.

The system must support:

- Admin-defined shipping cost.
- Free shipping.
- Shipping method selection.
- Tracking code.
- Shipping notes.
- Order shipping status.

Order statuses:

- Pending
- Awaiting Payment
- Confirmed
- Processing
- Ready for Shipment
- Shipped
- Delivered
- Cancelled

All statuses must have Persian translations in the UI.

---

# 9. Authentication and Authorization

Implement authentication for customers and administrators.

Customer authentication must support both:

1. Mobile number and password.
2. Mobile number and OTP.

Guest checkout must require OTP verification.

Administrator authentication must use secure credentials.

Security requirements:

- Hash passwords using a modern secure password hashing algorithm.
- Never store plaintext passwords.
- Secure session management.
- OTP expiration.
- OTP attempt limits.
- Rate limiting.
- Secure OTP verification.
- Protect sensitive routes.
- Prevent unauthorized order access.
- Validate all user inputs on the server.

Implement an SMS provider abstraction.

The SMS provider must be replaceable and compatible with Iranian SMS providers.

Do not make the application dependent on an international SMS API.

For development, provide a safe mock SMS adapter. Do not expose OTP codes in production logs or public responses.

---

# 10. Customer Dashboard

Implement a responsive customer dashboard with:

- Profile information.
- Order history.
- Order status tracking.
- Service request history.
- Service request tracking.
- Saved addresses.
- Personal information management.

Customers must only access their own data.

---

# 11. Admin Dashboard

Create a separate, professional admin dashboard.

Use a dedicated layout and navigation.

Admin features:

## Dashboard

- Total orders.
- Total revenue.
- Pending orders.
- Pending service requests.
- Total products.
- Low-stock products.
- Recent orders.
- Recent service requests.
- Sales statistics.

## Product Management

- Create products.
- Edit products.
- Delete products.
- Manage product images.
- Manage galleries.
- Manage inventory.
- Manage pricing.
- Configure fixed-price or quote-based purchasing.
- Manage product categories.

## Order Management

- View orders.
- Update order statuses.
- Manage payments.
- Set shipping costs.
- Set shipping methods.
- Add tracking codes.
- View customer information.

## Service Request Management

- View service requests.
- Update request statuses.
- Assign technicians or staff.
- Add internal notes.
- View customer contact details.

## Content Management

- Edit homepage content.
- Manage About Us content.
- Manage contact information.
- Manage FAQ.
- Manage blog articles.
- Manage customer reviews.
- Manage website images.

## Analytics

Implement basic internal analytics.

Track useful events such as:

- Page views.
- Product views.
- Add to cart.
- Checkout initiation.
- Successful orders.

Avoid mandatory dependence on Google Analytics or other restricted external services.

## Administrator Management

Support multiple administrators with role-based permissions.

Suggested roles:

- SUPER_ADMIN
- ADMIN
- PRODUCT_MANAGER
- ORDER_MANAGER
- CONTENT_MANAGER
- SERVICE_MANAGER

Enforce permissions on the server, not only in the UI.

Only authorized administrators should be able to manage roles and permissions.

---

# 12. Database Design

Use PostgreSQL and Prisma.

Design a normalized, maintainable relational database.

Include models for:

- User
- Account and Session if required by Auth.js
- OTP
- Address
- Product
- ProductCategory
- ProductImage
- ProductReview
- Cart if persistence is required
- Order
- OrderItem
- Payment
- Shipping
- ServiceRequest
- ServiceRequestNote
- BlogPost
- FAQ
- SiteSettings
- AdminRole
- AdminPermission
- AdminRolePermission
- PageContent
- Media
- AnalyticsEvent

Adjust this model list based on the actual application architecture.

Important database rules:

- Use proper relations and foreign keys.
- Add useful indexes.
- Use unique constraints where necessary.
- Use Decimal for financial values.
- Avoid floating-point calculations for money.
- Handle inventory updates safely.
- Use database transactions for critical operations.
- Store timestamps consistently.
- Never store sensitive payment credentials in database records without appropriate protection.

---

# 13. SEO

SEO must be implemented from the beginning.

Requirements:

- Persian metadata.
- Unique title and description per page.
- Dynamic product metadata.
- Dynamic category metadata.
- Dynamic blog metadata.
- Canonical URLs.
- Open Graph metadata.
- Twitter metadata.
- Sitemap generation.
- robots.txt.
- Structured data using JSON-LD.

Implement relevant structured data:

- Organization.
- LocalBusiness.
- Product.
- BreadcrumbList.
- Article.
- FAQPage when applicable.

Optimize for local SEO in Qazvin.

Important keywords should naturally cover topics such as:

- تعمیر پکیج در قزوین
- سرویس پکیج در قزوین
- فروش پکیج
- خرید رادیاتور
- قطعات پکیج
- تجهیزات گرمایشی

Do not keyword-stuff content.

Use semantic HTML and accessible markup.

Optimize Core Web Vitals and page loading performance.

---

# 14. Compatibility with Iranian Infrastructure

This is a critical requirement.

The application must be suitable for deployment on Iranian hosting providers and VPS servers.

Avoid mandatory dependencies on services that may be inaccessible or unreliable from Iran.

Specific requirements:

- Use locally hosted fonts.
- Avoid runtime dependency on Google Fonts.
- Do not require Google Maps.
- Avoid mandatory Google Analytics.
- Do not rely on international SMS services.
- Keep payment integration compatible with Iranian gateways.
- Make storage configurable.
- Support local file storage and S3-compatible storage through an abstraction.
- Avoid unnecessary external APIs.
- Use environment variables for all credentials and service configuration.

The website must remain functional if optional external services are unavailable.

---

# 15. Performance and Security

Follow production-quality practices.

Performance:

- Optimize images.
- Use Next.js Image where appropriate.
- Use Server Components by default.
- Implement pagination.
- Avoid unnecessary client-side JavaScript.
- Avoid excessive re-renders.
- Use caching appropriately.
- Prevent N+1 database queries.

Security:

- Validate inputs using Zod.
- Enforce authorization on the server.
- Protect admin routes.
- Implement rate limiting for authentication and OTP.
- Prevent insecure direct object references.
- Protect against common web vulnerabilities.
- Never expose secrets in client-side code.
- Never trust client-provided prices or inventory values.
- Verify payment callbacks server-side.
- Prevent duplicate order submissions.

---

# 16. Seed Data and Initial Content

Create a Prisma seed script.

Include realistic demo data for:

- Product categories.
- Sample boilers.
- Sample radiators.
- Sample spare parts.
- Sample installation accessories.
- Sample blog articles.
- Sample FAQ entries.
- Sample customer reviews.

Use clearly labeled demo content.

Do not present invented customer reviews, certifications, or business achievements as verified real information.

Create an initial administrator through a secure environment-based setup process. Never hardcode production credentials.

---

# 17. Development Workflow — Very Important

Do not attempt to generate the entire application in one uncontrolled operation.

Follow these phases:

## Phase 1 — Project Inspection

Before changing anything:

1. Inspect the entire project structure.
2. Read package.json.
3. Inspect Next.js and TypeScript versions.
4. Inspect Tailwind configuration.
5. Identify existing components and dependencies.
6. Identify any existing code worth preserving.
7. Check whether environment files or database configuration already exist.

Then provide a concise Persian report explaining:

- Current project status.
- Existing dependencies.
- Missing dependencies.
- Proposed architecture.
- Potential compatibility issues.

Do not delete or overwrite existing files without a clear technical reason.

## Phase 2 — Foundation

Implement:

- Project architecture.
- Global styles.
- RTL configuration.
- Persian typography.
- Design system.
- Shared components.
- Database setup.
- Prisma schema.
- Environment configuration.

Run the necessary checks.

## Phase 3 — Public Website

Implement the homepage, product catalog, product details, services, About Us, Contact Us, and blog.

Focus on high-quality UI/UX.

## Phase 4 — Authentication

Implement customer authentication, OTP verification, guest checkout verification, and administrator authentication.

## Phase 5 — Shopping System

Implement the cart, checkout, orders, shipping, and payment abstraction.

## Phase 6 — Customer Dashboard

Implement customer profile, orders, addresses, and service request tracking.

## Phase 7 — Admin Dashboard

Implement product management, orders, services, content management, analytics, and role-based permissions.

## Phase 8 — SEO and Optimization

Implement metadata, sitemap, robots.txt, structured data, image optimization, and performance improvements.

## Phase 9 — Final Testing

Run:

- TypeScript checks.
- ESLint.
- Production build.
- Prisma validation.
- Database checks.
- Critical workflow tests.

Fix all errors introduced by your implementation.

Do not claim that a feature works unless it has actually been implemented and tested.

---

# 18. Working Rules

1. Work directly in the existing project.
2. Do not just provide code snippets; implement the required functionality.
3. Do not create fake implementations of critical business features.
4. Do not use `any`.
5. Keep components reusable but avoid overengineering.
6. Use meaningful TypeScript types.
7. Use English comments in code.
8. Keep the UI completely Persian and RTL.
9. Explain completed work in Persian.
10. If a required credential or external service is missing, create a clean adapter and explain what configuration is needed.
11. Never invent credentials, API keys, phone numbers, or payment confirmations.
12. Do not silently skip requested features.
13. Keep a clear record of completed and remaining tasks.
14. Test after every major phase.
15. Preserve existing working functionality.

If an important requirement is ambiguous, ask me in Persian before making an irreversible architectural decision. For minor details, use sensible professional defaults and document your decisions.

# Final Goal

Deliver a polished, modern, responsive, secure, SEO-friendly Persian e-commerce and service website for Jahan Alborz.

The result must be a real, maintainable Next.js application suitable for future deployment on Iranian hosting infrastructure, not merely a visual prototype.

Start with Phase 1: inspect the existing project and report your findings in Persian. Do not immediately generate the entire application.
