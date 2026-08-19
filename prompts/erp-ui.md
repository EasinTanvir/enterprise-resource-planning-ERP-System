# ERP UI Implementation Prompt

## Goal

Build the complete frontend UI for the physical-retail ERP with realistic deterministic dummy data. Preserve the new multi-tenant Next.js App Router structure. This prompt covers frontend routes, layouts, components, local state, and visual behavior only. Do not implement backend APIs, database work, authentication infrastructure, or RLS in this frontend pass.

## Skills Read

- `AGENTS.md`
- Next.js 16 App Router conventions, including `proxy.js` replacing `middleware.js`
- Tailwind CSS v4 conventions
- Vercel Platforms multi-tenant example: `https://github.com/vercel/platforms`
- `.agents/skills/neon-postgres/SKILL.md` is not required for dummy-data-only UI work

## Existing Code Inspected

- `package.json`: Next.js 16.3.1, React 19.2.8, Tailwind CSS 4, `lucide-react`, and `react-hook-form` are installed.
- `src/app/layout.js`: root document shell, Geist fonts, and metadata.
- `src/app/globals.css`: existing global styles and visual tokens.
- `src/proxy.js`: detects local, production, and Vercel preview subdomains; currently rewrites only a subdomain root request to `/s/[subdomain]`.
- `src/lib/utils.js`: defines `rootDomain` from `NEXT_PUBLIC_ROOT_DOMAIN`, defaulting to `localhost:3000`.
- `src/app/(platform)/layout.js` and tenant admin page placeholders.
- `src/app/(auth)/login/page.js` and `register/page.js` placeholders.
- `src/app/(tenants)/layout.js` and `src/app/(tenants)/s/[subdomain]/page.js` placeholders.
- `src/components/erp-app.js`: older client-side pathname router and tenant shell. Reuse selectively, but do not let it replace real App Router pages.

## Product Context

This is a multi-tenant SaaS ERP for physical retail organizations. The main domain belongs to the platform owner, who creates and manages organizations. Each organization operates its own ERP workspace on a subdomain.

UI scope includes dashboard, customers, products, categories, inventory, suppliers, purchasing, sales, returns, invoices, payments, reports, employees, roles, notifications, audit logs, and settings.

Do not add ecommerce, online storefronts, shopping carts, online checkout, online ordering, marketplace features, recurring subscriptions, complex accounting, payroll, HR, manufacturing, or unrelated modules.

## Route Architecture

Parenthesized route groups are organizational and do not appear in public URLs.

### Main domain and platform admin

- `http://localhost:3000/`: main-domain entry or platform owner landing experience.
- `http://localhost:3000/admin/tenants`: organization list and platform administration.
- `http://localhost:3000/admin/tenants/new`: create organization and configure its initial tenant identity.
- `http://localhost:3000/admin/tenants/[tenantId]`: organization details, status, lifetime license, and management actions.

These pages belong under `src/app/(platform)/` and use the platform layout. They are not tenant workspace pages.

### Authentication

- `http://localhost:3000/login`
- `http://localhost:3000/register`
- `http://localhost:3000/forgot-password`

These pages belong under `src/app/(auth)/` and use an access-focused layout without tenant navigation. Registration is platform/account onboarding, not online customer registration.

### Tenant subdomains

For tenant slug `abc`, the public origin is `http://abc.localhost:3000/`. The proxy detects `abc` and internally maps the request to routes below `src/app/(tenants)/s/[subdomain]/`.

Examples:

- `http://abc.localhost:3000/` -> internal `/s/abc`
- `http://abc.localhost:3000/customers` -> internal `/s/abc/customers`
- `http://abc.localhost:3000/products/p-1` -> internal `/s/abc/products/p-1`

Never show `/s/abc` in tenant-facing links or navigation. Preserve the dynamic `subdomain` route parameter as tenant UI context and use tenant-scoped dummy data.

The current `proxy.js` rewrites only the subdomain root. Before declaring nested tenant URLs complete, extend the routing strategy so every supported tenant pathname maps to `/s/[subdomain]/...` without exposing that internal path. Preserve exclusions for API routes, Next internals, and public files. A subdomain must not enter the platform admin shell.

## Tenant Page Inventory

Implement these pages under `src/app/(tenants)/s/[subdomain]/` with a shared tenant layout:

- `/` - dashboard
- `/customers` and `/customers/[customerId]`
- `/products` and `/products/[productId]`
- `/categories`
- `/inventory` and `/inventory/movements`
- `/suppliers` and `/suppliers/[supplierId]`
- `/purchases`, `/purchases/new`, and `/purchases/[purchaseId]`
- `/sales`, `/sales/new`, and `/sales/[saleId]`
- `/returns`, `/returns/new`, and `/returns/[returnId]`
- `/invoices` and `/invoices/[invoiceId]`
- `/payments` and `/payments/[paymentId]`
- `/reports`
- `/employees` and `/employees/[employeeId]`
- `/roles` and `/roles/[roleId]`
- `/notifications`
- `/audit-logs`
- `/settings/company`, `/settings/invoice`, `/settings/tax`, and `/settings/profile`

Dynamic pages must read route params and render tenant-specific records. Do not hard-code one tenant into page components.

## Platform Admin Page Requirements

Expand the existing platform admin placeholders under `src/app/(platform)/`:

- `/admin/tenants`: searchable/filterable organization table with status, lifetime-license state, slug, owner, creation date, and actions.
- `/admin/tenants/new`: organization form with name, slug validation, owner/admin details, and lifetime-license setup UI.
- `/admin/tenants/[tenantId]`: organization summary, status controls, license details, activity, and contextual actions.

Use platform-level dummy data separate from tenant business data. Do not display tenant sales, customers, or inventory on admin pages except as explicit platform summaries.

## Architecture Decisions

- Keep frontend code in Next.js under `src/app`; keep the NestJS backend in `server/`, but do not add backend work for this prompt.
- Use real App Router `page.js` files and layouts. Add `loading.js`, `error.js`, and `not-found.js` where useful.
- Do not build the product as one client-side pathname switch.
- Use separate but related auth, admin, and tenant shells.
- Use client components only for interaction or local state.
- Use local deterministic dummy data; do not invent backend APIs or pretend mutations persist remotely.
- Use `subdomain` from the dynamic route as UI context. It is not an authorization mechanism.
- Reuse data-driven components instead of duplicating shell, table, or form markup.
- Use `react-hook-form` for interactive forms with accessible field-level validation messages.
- Use `lucide-react` for icons and Tailwind CSS v4 with the existing `globals.css` theme.
- Keep tenant navigation host-aware and use public subdomain-relative links. Admin and auth links target main-domain routes.

## UI Requirements

- Tenant shell: sidebar, top bar, breadcrumbs, page header, filters, tables, badges, dialogs, forms, toasts, empty/loading/error states, and confirmation actions.
- Admin shell: platform-oriented navigation and organization management views, not store operations navigation.
- Auth shell: focused login, registration, and recovery experience without tenant navigation.
- Lists: search/filter, realistic rows, primary action, pagination or compact alternative, and all meaningful states.
- Details: summary, activity/history, status, and contextual actions.
- Sales, purchasing, and returns: line-item entry, quantities, prices, discounts, tax, totals, and validation.
- Reports: filters, KPI summaries, visual summaries, and tabular details.
- Use believable Bangladesh retail examples and BDT currency formatting.
- Desktop uses dense operational layouts; mobile uses collapsible navigation, stacked filters, scrollable tables, and full-width actions.
- Provide visible focus states, semantic headings, labels, keyboard support, sufficient contrast, text-based status meaning, stable control dimensions, and reduced-motion support.
- Use the existing restrained retail visual direction: warm workspace, ink text, graphite navigation, burnt-coral accent, and restrained status colors. Avoid generic purple gradients, decorative blobs, glassmorphism, excessive cards, and oversized hero text.

## Files Likely To Change

- `src/proxy.js` for complete public-subdomain-to-internal-route rewriting, if required.
- `src/lib/utils.js` for small host/subdomain URL helpers, if required.
- `src/app/layout.js` and `src/app/globals.css`.
- `src/app/page.js` for the main-domain entry experience.
- `src/app/(platform)/layout.js` and platform admin routes.
- `src/app/(auth)/layout.js` and auth routes.
- `src/app/(tenants)/layout.js`, `src/app/(tenants)/s/[subdomain]/layout.js`, and tenant routes.
- Reusable components/data/helpers under `src/components`, `src/lib`, and/or `src/app`.
- `package.json` only if a genuinely required dependency is missing; reuse installed packages first.

## Implementation Plan

1. Confirm the route tree and read current Next.js 16 proxy guidance.
2. Establish theme tokens, typography, focus states, and utilities in `globals.css`.
3. Build separate auth, admin, and tenant layouts.
4. Make root and nested subdomain paths rewrite correctly while keeping `/s/[subdomain]` internal.
5. Build shared primitives and deterministic platform/tenant data helpers.
6. Add all tenant and platform admin pages in the inventory above.
7. Add host-aware navigation, responsive behavior, dialogs, toasts, and validation.
8. Add route-level loading, empty, error, and not-found handling where appropriate.
9. Run frontend checks and fix only issues caused by this work.

## Acceptance Criteria

- Main-domain admin, auth, and subdomain tenant routes use the correct layout group and render without runtime errors.
- `http://localhost:3000/admin/tenants` remains platform administration, while `http://abc.localhost:3000/` opens the `abc` tenant workspace.
- Supported tenant paths work from a subdomain without exposing `/s/[subdomain]` in browser-facing links.
- Tenant UI data changes with the subdomain context and is never mixed with platform-admin data.
- A subdomain cannot enter the platform admin shell through normal tenant navigation.
- Components are reusable, forms use React Hook Form, dummy data uses BDT, and the UI works at desktop and mobile widths.
- Loading, empty, error, confirmation, success, and disabled states are represented where appropriate.
- No ecommerce or recurring-subscription behavior is introduced.
- `npm run lint` and `npm run build` pass.

## Manual Testing Steps

1. Visit `http://localhost:3000/admin/tenants`, open the new-tenant form, and verify admin validation.
2. Visit `/login`, `/register`, and `/forgot-password`; verify the auth shell is separate.
3. Visit `http://abc.localhost:3000/` and verify tenant context and dashboard.
4. Navigate through tenant customers, products, inventory, purchasing, sales, returns, invoices, payments, reports, employees, roles, notifications, audit logs, and settings.
5. Test tenant detail pages and create forms with invalid and valid values.
6. Test line-item totals and validation on sales, purchases, and returns.
7. Verify tenant links never expose `/s/abc`; change `abc` to another slug and verify tenant-scoped dummy data changes.
8. Verify a tenant-origin request cannot render platform admin pages.
9. Resize to mobile and verify all shells, forms, tables, dialogs, and primary actions remain usable.
10. Run `npm run lint` and `npm run build`.
