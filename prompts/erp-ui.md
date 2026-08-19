# ERP UI Implementation Prompt

## Goal

Build the complete frontend UI for the physical-retail ERP using realistic dummy data. The result should feel like a deliberate, production-style business application rather than a generated dashboard mockup.

## Skills Read

- `AGENTS.md`
- `.agents/skills/neon-postgres/SKILL.md` (not needed for dummy-data UI implementation)
- Next.js 16 App Router conventions
- Tailwind CSS v4 conventions

## Existing Code Inspected

- `package.json`: Next.js 16.3.1, React 19.2.8, Tailwind CSS 4; no form or icon library installed.
- `src/app/page.js`: placeholder page only.
- `src/app/layout.js`: Geist font shell and default metadata.
- `src/app/globals.css`: Tailwind import only.
- `postcss.config.mjs`: Tailwind v4 PostCSS plugin.

## Product Context

This is a multi-tenant physical retail ERP. UI scope covers store operations: dashboard, customers, products, categories, inventory, suppliers, purchasing, sales, returns, invoices, payments, reports, employees, roles, notifications, audit logs, and settings. Do not add ecommerce, online ordering, subscriptions, or unrelated modules.

## Architecture Decisions

- Keep the frontend in Next.js under `src/app`.
- Use a reusable application shell with sidebar, top bar, breadcrumbs, page headers, filters, tables, status badges, drawers/modals, forms, empty states, loading states, and confirmation dialogs.
- Use client components only where interaction/state is required.
- Use local dummy data and local UI state; do not invent backend APIs.
- Prefer reusable components and data-driven page configuration over duplicated page markup.
- Add `react-hook-form` and a schema validation library if needed for reliable field-level validation. All interactive forms must use React Hook Form and display accessible validation messages beside invalid fields.
- Use an existing icon library such as `lucide-react` for interface icons rather than hand-drawn SVG icons.
- Use Tailwind CSS v4 and define the visual theme in `src/app/globals.css` with CSS custom properties and `@theme` integration where appropriate.
- Preserve the existing JavaScript project configuration unless TypeScript is required for a dependency integration.

## Visual Direction

Create a quiet, confident retail-operations interface:

- Warm off-white workspace background, ink-colored text, graphite navigation, and a distinctive burnt-coral accent with restrained green/amber/red status colors.
- Use Geist only if it remains the best fit; otherwise choose a purposeful, readable sans-serif already available without adding unnecessary font infrastructure.
- Dense enough for scanning, with generous rhythm around major sections.
- Avoid excessive cards, oversized hero text, generic purple gradients, decorative blobs, glassmorphism, and symmetrical dashboard filler.
- Use tables and split layouts where operational users need comparison.
- Keep cards at small radii and reserve them for repeated records, panels, and dialogs.
- Use meaningful page-load/staggered reveal motion sparingly and respect reduced-motion preferences.

## Pages and Routes

Implement the following usable routes with realistic dummy data and consistent shell/navigation:

### Access

- `/login`
- `/forgot-password`

### Tenant workspace

- `/dashboard`
- `/customers`
- `/customers/[customerId]`
- `/products`
- `/products/[productId]`
- `/categories`
- `/inventory`
- `/inventory/movements`
- `/suppliers`
- `/suppliers/[supplierId]`
- `/purchases`
- `/purchases/new`
- `/purchases/[purchaseId]`
- `/sales`
- `/sales/new`
- `/sales/[saleId]`
- `/returns`
- `/returns/new`
- `/returns/[returnId]`
- `/invoices`
- `/invoices/[invoiceId]`
- `/payments`
- `/payments/[paymentId]`
- `/reports`
- `/employees`
- `/employees/[employeeId]`
- `/roles`
- `/roles/[roleId]`
- `/notifications`
- `/audit-logs`
- `/settings/company`
- `/settings/invoice`
- `/settings/tax`
- `/settings/profile`

### Platform administration

- `/admin/tenants`
- `/admin/tenants/new`
- `/admin/tenants/[tenantId]`

Every list page needs search/filter affordances, realistic populated rows, empty/loading/error visual states, pagination or a clear compact alternative, and a primary action. Detail pages need summary information, activity/history, and contextual actions. Creation/edit flows need complete forms with validation. Sales and purchases should visually support line-item entry and totals. Reports should provide filters, KPI summaries, charts or visual summaries, and tabular detail.

## Reusable UI Building Blocks

Create a small local component system for:

- App shell, sidebar, topbar, mobile navigation, breadcrumbs, page header.
- Buttons, icon buttons with tooltips, inputs, selects, textareas, date range controls, checkboxes, segmented controls, tabs, dropdown menus.
- Data table, pagination, filter bar, search field, stat row, chart/metric visual, status badge, avatar, empty state, loading skeleton, error state, toast, modal/drawer, confirmation dialog.
- Form field wrappers integrated with React Hook Form, including label, hint, error, required state, and accessible IDs.
- Domain-specific line-item editor for sale/purchase/return forms.

## Dummy Data

Use believable Bangladesh retail examples and BDT currency formatting: products such as smartphones and accessories, named customers/suppliers/employees, invoice numbers, SKU values, stock movement reasons, payment methods, and dates. Keep data deterministic and tenant-scoped in the UI. Avoid lorem ipsum and repetitive placeholder labels.

## Form Requirements

- Every input form uses React Hook Form.
- Validate required fields, email formats, phone formats, numeric ranges, quantities, prices, and confirmation fields where relevant.
- Show concise field-level messages and a form-level error state.
- Prevent invalid submit, show pending/submitted feedback, and keep controls keyboard accessible.
- Include validation for login, forgot-password, customer, product, supplier, purchase, sale, return, employee, role, settings, and tenant forms.

## Responsive and Accessibility Requirements

- Desktop: persistent navigation and dense operational content.
- Tablet/mobile: collapsible navigation, horizontally scrollable tables where necessary, stacked filters, full-width primary actions, and forms that remain comfortable to complete.
- Visible focus states, semantic headings, labels tied to controls, keyboard support, sufficient contrast, status conveyed by text as well as color, and reduced-motion support.
- Stable dimensions for buttons, table rows, controls, and line-item columns so dynamic content does not shift layouts.

## Files Likely To Change

- `package.json` and `package-lock.json`
- `src/app/layout.js`
- `src/app/globals.css`
- `src/app/page.js`
- New reusable components/data/helpers under `src/components`, `src/lib`, and/or `src/app` following the smallest clear structure.
- New route files under `src/app/**`.

## Implementation Plan

1. Add minimal UI dependencies for forms, validation, and icons.
2. Establish theme tokens, base styles, typography, focus states, and utility classes in `globals.css`.
3. Build the reusable shell and primitives.
4. Build representative route templates and domain components.
5. Add all required list, detail, create/edit, report, and settings routes using deterministic dummy data.
6. Add route-aware active navigation, responsive behavior, dialogs, toasts, and form validation.
7. Update metadata and root redirect/landing behavior appropriately.
8. Run lint and production build; fix only issues caused by this feature.

## Acceptance Criteria

- All listed routes render without runtime errors and share a coherent professional ERP shell.
- The visual system is defined in `globals.css` and uses Tailwind CSS v4 utilities.
- Reusable components are used across pages; there is no copy-pasted page shell or form-field markup.
- Forms use React Hook Form with proper validation messages and accessible labels.
- Dummy data feels like a real physical retail operation and uses BDT consistently.
- The UI is responsive and usable at desktop and mobile widths.
- Loading, empty, error, confirmation, success, and disabled states are represented where appropriate.
- No ecommerce or recurring-subscription behavior is introduced.
- `npm run lint` and `npm run build` pass.

## Manual Testing Steps

1. Visit `/dashboard`, collapse and reopen the sidebar, and verify active navigation.
2. Test `/customers`, search/filter rows, open a customer detail page, and submit the customer form with invalid and valid values.
3. Test product, supplier, employee, role, settings, and tenant forms for field-level validation.
4. Open `/sales/new`, add/remove line items, change quantities/prices, and verify totals and validation feedback.
5. Repeat the line-item workflow for purchase and return pages.
6. Check list/detail pages for invoices, payments, inventory, and audit logs.
7. Check report filters and responsive table/chart behavior.
8. Resize to mobile width and verify navigation, forms, tables, dialogs, and primary actions remain usable.
9. Run `npm run lint` and `npm run build`.
