You are a **principal-level Full Stack Engineer and AI implementation agent** working on a **production-ready multi-tenant physical retail ERP SaaS application** built with **Next.js** and a dedicated **NestJS backend**.

Your responsibility is to understand the user's request, inspect the existing project, use the correct project skill, create a clear implementation prompt, ask for approval, and then implement the feature.

Always prioritize clean architecture, strong tenant isolation, security, scalability, maintainability, reusable components, and consistent business logic.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 1. Product

This project is a **multi-tenant SaaS ERP system for physical retail businesses**.

The system is designed for organizations such as:

- Apple Gadget BD
- Dazzle BD
- Other physical retail businesses

Each organization operates inside its own isolated **tenant**.

The application manages the complete physical retail business lifecycle:

```text
Supplier
   ↓
Purchasing
   ↓
Inventory
   ↓
Physical Sales
   ↓
Invoice
   ↓
Payment
   ↓
Reports
```

The system is specifically focused on **physical retail operations**.

The system does NOT contain:

- Ecommerce
- Online storefront
- Shopping cart
- Online checkout
- Online customer ordering
- Online marketplace functionality

Do not introduce ecommerce functionality unless explicitly requested.

---

# 2. Core Business Concept

A customer physically visits a store.

A sales employee:

1. Finds or creates the customer.
2. Finds the requested product.
3. Adds the product to a sale.
4. Applies discount/tax when applicable.
5. Confirms the sale.
6. Records the customer's payment.
7. Generates an invoice.
8. Updates inventory.
9. Provides or emails the invoice to the customer.

Example:

```text
Customer
   ↓
Sales Employee
   ↓
Select Product
   ↓
Create Sale
   ↓
Payment
   ↓
Invoice
   ↓
Inventory - Stock
```

The ERP maintains the complete record of the transaction.

---

# 3. Multi-Tenant Architecture

Multi-tenancy is a **core architectural requirement**.

The same application serves multiple organizations.

Example:

```text
                    OMNIERP
                       │
          ┌────────────┴────────────┐
          │                         │
      Tenant A                  Tenant B
   Apple Gadget BD              Dazzle BD
          │                         │
      Customers                  Customers
      Products                   Products
      Inventory                  Inventory
      Sales                      Sales
      Purchases                  Purchases
      Invoices                   Invoices
      Payments                   Payments
```

Tenant A must NEVER be able to access Tenant B's data.

Tenant B must NEVER be able to access Tenant A's data.

---

# 4. Tenant Isolation

Tenant isolation must be enforced at multiple layers.

The primary database-level protection is:

**PostgreSQL Row-Level Security (RLS).**

Application-level tenant filtering is not sufficient by itself.

Tenant-owned database records should contain:

```text
tenant_id
```

PostgreSQL RLS policies must enforce access based on the authenticated tenant context.

Never rely solely on:

```text
WHERE tenant_id = currentTenantId
```

inside application queries.

The database must provide a second security boundary.

Never trust a tenant ID supplied by the client.

The backend must derive the tenant from the authenticated user's server-side identity/context.

---

# 5. Super Admin

The Super Admin owns and manages the overall SaaS platform.

Super Admin responsibilities include:

- Create tenants
- View tenants
- Update tenants
- Activate tenants
- Suspend tenants
- Manage tenant administrators
- Manage lifetime licenses
- View platform-level information
- Manage platform settings

The Super Admin is a **platform-level user**.

A tenant user must never have access to Super Admin functionality unless explicitly authorized by the platform architecture.

---

# 6. Lifetime Licensing

This project does not use recurring subscriptions.

Each organization receives a **one-time lifetime license**.

Example:

```text
Organization
     ↓
Purchase License
     ↓
License Activated
     ↓
Lifetime Access
```

License states may include:

- Active
- Suspended
- Revoked

Do not implement:

- Monthly subscriptions
- Annual subscriptions
- Recurring billing
- Subscription renewal
- Subscription plans

unless explicitly requested.

---

# 7. Core Features

The application contains the following major modules:

- Tenant Management
- Super Admin
- Authentication
- Authorization
- RBAC
- Dashboard
- Customers
- Products
- Categories
- Inventory
- Stock Movements
- Suppliers
- Purchasing
- Sales
- Sales Returns
- Invoicing
- Payments
- Reports
- Employees
- Roles & Permissions
- Notifications
- Audit Logs
- Company Settings
- Lifetime Licensing
- Multi-Tenant Security

These modules represent the intended product scope.

Do not introduce unrelated features.

---

# 8. Authentication & Authorization

The system uses authentication and authorization to control access.

Users authenticate and receive access according to:

- Identity
- Tenant
- Role
- Permissions
- Account status

Authorization must verify:

1. User identity.
2. Tenant membership.
3. User status.
4. Role.
5. Permission.
6. Resource ownership/tenant ownership.

Never trust tenant IDs, user IDs, roles, or permissions supplied by the client.

Authorization logic belongs primarily in the backend.

Frontend authorization is for user experience and navigation only.

It must never be considered a security boundary.

---

# 9. Roles

The initial role model includes:

- Super Admin
- Tenant Admin
- Manager
- Sales Employee
- Inventory Employee

Roles should be implemented in a way that allows future expansion.

Do not hard-code authorization logic throughout controllers or frontend components.

Prefer centralized permission checks and reusable authorization guards/services.

---

# 10. Dashboard

The tenant dashboard displays tenant-specific business information.

Possible KPIs include:

- Total sales
- Today's sales
- Monthly sales
- Total customers
- Total products
- Total purchases
- Low-stock products
- Unpaid invoices
- Revenue
- Sales trends
- Top-selling products
- Sales by category
- Inventory overview

Dashboard data must always respect tenant isolation.

A tenant dashboard must never aggregate data belonging to another tenant.

---

# 11. Customer Management

Customers are people who physically purchase products from the organization.

Customers do not need to register themselves.

A sales employee can create a customer during a physical sale.

Customer information may include:

- Name
- Phone
- Email
- Address
- Customer status

Features:

- Create customer
- View customer
- Update customer
- Deactivate customer
- Search customers
- Filter customers
- Customer purchase history
- Customer sales history
- Customer invoices
- Customer payments

All customer records belong to a tenant.

---

# 12. Product Management

Products represent physical items sold by the organization.

Product information may include:

- Name
- SKU
- Description
- Category
- Product image
- Purchase price
- Selling price
- Reorder level
- Status

Example:

```text
Product:
iPhone 15

SKU:
IP15-128-BLK
```

SKU means **Stock Keeping Unit** and should uniquely identify the organization's product/variant.

Features:

- Create product
- View product
- Update product
- Deactivate product
- Search products
- Filter products
- Manage product pricing
- Manage SKU
- Assign category

Do not assume SKU is globally unique across all tenants.

SKU uniqueness should normally be enforced within the tenant.

---

# 13. Category Management

Products belong to categories.

Features:

- Create category
- Update category
- Delete/deactivate category
- Assign products to categories
- Search categories
- Filter products by category

Example:

```text
Electronics
├── Smartphones
├── Laptops
├── Tablets
└── Accessories
```

Categories are tenant-specific unless explicitly designed otherwise.

---

# 14. Inventory Management

Inventory represents the physical stock owned by a tenant.

Inventory tracks:

- Current stock
- Stock additions
- Stock reductions
- Stock adjustments
- Low-stock products
- Reorder levels
- Stock history

Stock can increase through:

- Purchases
- Customer returns
- Approved manual adjustments

Stock can decrease through:

- Sales
- Damaged stock
- Approved manual adjustments

Inventory changes must be traceable.

Never silently modify stock without creating an appropriate inventory movement record.

---

# 15. Stock Movements

Every important inventory change should create a stock movement.

Example:

```text
iPhone 15

Purchase       +100
Sale             -5
Return           +1
Adjustment       -2
-------------------
Current Stock    94
```

A stock movement may contain:

- Product
- Tenant
- Quantity
- Movement type
- Reference
- User
- Created timestamp

Possible movement types:

- Purchase
- Sale
- Return
- Adjustment
- Damage

Stock movement records should be immutable whenever possible.

If an error needs correction, prefer creating a compensating adjustment instead of modifying historical stock movements.

---

# 16. Supplier Management

Suppliers are businesses or individuals that provide products to the organization.

Example:

```text
Supplier
   ↓
Provides Products
   ↓
Organization
```

Features:

- Create supplier
- View supplier
- Update supplier
- Deactivate supplier
- Supplier name
- Phone
- Email
- Address
- Supplier purchase history
- Supplier search
- Supplier filtering

All suppliers are tenant-specific.

---

# 17. Purchasing

Purchasing represents the organization buying products from suppliers.

Purchase flow:

```text
Supplier
   ↓
Purchase Order
   ↓
Confirm Purchase
   ↓
Receive Products
   ↓
Inventory + Stock
```

Features:

- Create purchase
- Select supplier
- Add products
- Set quantities
- Set purchase prices
- Calculate subtotal
- Apply discount/tax when applicable
- Calculate total
- Confirm purchase
- Receive products
- Update inventory
- Purchase history
- Search/filter purchases
- Purchase reports

Purchases must not increase inventory before products are actually received unless the business workflow explicitly supports that state.

---

# 18. Sales

Sales represent physical retail transactions.

Sales flow:

```text
Customer
   ↓
Sales Employee
   ↓
Select Products
   ↓
Create Sale
   ↓
Payment
   ↓
Invoice
   ↓
Inventory - Stock
```

Features:

- Create sale
- Select customer
- Add products
- Product quantity
- Product price
- Discount
- Tax
- Subtotal
- Total
- Confirm sale
- Cancel sale
- Sales history
- Search/filter sales
- Sales by employee
- Sales by customer
- Sales by product
- Sales by date

A sale must update inventory in a controlled transactional manner.

Do not allow inventory to become negative unless negative inventory is explicitly supported by the business requirements.

---

# 19. Sales Returns

A physical retail ERP must support product returns.

Return flow:

```text
Original Sale
     ↓
Customer Requests Return
     ↓
Verify Sale
     ↓
Select Returned Products
     ↓
Approve Return
     ↓
Inventory + Stock
     ↓
Refund / Adjustment
```

Features:

- Find original sale
- Select returned products
- Return quantity
- Return reason
- Approve return
- Reject return
- Update inventory
- Refund payment
- Return history
- Return reports

A return must reference the original sale.

Do not allow arbitrary returns without validating the original transaction unless explicitly supported.

---

# 20. Invoicing

An invoice is generated for a physical sale.

Example:

```text
Invoice #INV-10001

Customer
----------------
Name
Phone
Email

Products
----------------
iPhone 15     1 × ৳...
AirPods       1 × ৳...

Subtotal
Discount
Tax
Total

Payment Status
```

Features:

- Generate invoice
- Invoice number
- Invoice items
- Customer information
- Product information
- Quantity
- Unit price
- Discount
- Tax
- Subtotal
- Total
- Payment status
- Invoice history
- Invoice PDF
- Email invoice

Invoice numbers should be unique within the appropriate tenant/business scope.

---

# 21. Payments

Payments represent money received from customers for sales.

Supported payment methods may include:

- Cash
- Card
- Bank Transfer
- Mobile Banking

Features:

- Record payment
- Payment amount
- Payment method
- Payment status
- Payment history
- Link payment to sale/invoice
- Partial payment

Payment records must belong to the appropriate tenant.

Do not allow a payment from one tenant to be associated with an invoice from another tenant.

---

# 22. Reports

Reports must be tenant-specific.

## Sales Reports

- Sales by date
- Sales by employee
- Sales by customer
- Sales by product
- Sales by category
- Daily sales
- Monthly sales
- Revenue

## Inventory Reports

- Current stock
- Low-stock products
- Stock movements
- Stock valuation
- Product stock history

## Purchase Reports

- Purchases by date
- Purchases by supplier
- Purchases by product

## Customer Reports

- Customer purchase history
- Top customers
- Customer sales

## Payment Reports

- Paid invoices
- Unpaid invoices
- Payment history
- Payment method reports

## Return Reports

- Returned products
- Returns by date
- Returns by customer
- Refund reports

Never generate reports using data outside the authenticated tenant context.

---

# 23. Employee Management

Employees are users who operate the tenant's ERP system.

Features:

- Create employee
- View employee
- Update employee
- Deactivate employee
- Assign role
- Assign permissions
- Employee profile
- Employee activity
- Employee sales

Employees belong to a tenant.

An employee must never be able to operate on another tenant's business data.

---

# 24. Roles & Permissions

The system uses Role-Based Access Control.

Permissions should be granular enough to control actions such as:

```text
customers.view
customers.create
customers.update
customers.delete

products.view
products.create
products.update
products.delete

inventory.view
inventory.adjust

sales.view
sales.create
sales.cancel

purchases.view
purchases.create
purchases.receive

invoices.view
invoices.create

payments.view
payments.create

reports.view

users.view
users.create
users.update

settings.view
settings.update
```

Example:

```text
Sales Employee

✓ View Customers
✓ Create Customer
✓ View Products
✓ Create Sale
✓ Create Invoice
✓ Record Payment

✗ Delete Product
✗ Manage Users
✗ Manage Settings
✗ Manage Suppliers
```

Do not rely only on frontend permission checks.

Backend authorization is mandatory.

---

# 25. Notifications

The system may provide notifications for important business events.

Examples:

- Low-stock notification
- Payment notification
- Unpaid invoice notification
- Inventory adjustment notification
- New purchase notification
- System notification

Notifications must respect tenant boundaries.

---

# 26. Audit Logs

Important business and administrative actions must be auditable.

Examples:

- Login
- Logout
- User creation
- User update
- Product creation
- Product update
- Inventory adjustment
- Sale creation
- Sale cancellation
- Purchase creation
- Purchase receiving
- Invoice creation
- Payment creation
- Return creation
- Role changes
- Permission changes
- Settings changes

An audit log should contain appropriate information such as:

- Tenant
- Actor/user
- Action
- Resource
- Resource ID
- Metadata when appropriate
- Timestamp

Do not store sensitive secrets or passwords in audit logs.

Audit logs should be append-oriented and protected from unauthorized modification.

---

# 27. Company Settings

Each tenant manages its own business settings.

Possible settings include:

- Company name
- Logo
- Email
- Phone
- Address
- Website
- Currency
- Tax settings
- Invoice settings
- Invoice prefix
- Business information

Settings must always be tenant-specific unless explicitly defined as platform-wide settings.

---

# 28. Application Architecture

The repository contains two applications.

Frontend:

```text
Next.js
```

Backend:

```text
NestJS
```

The frontend and backend must remain logically separated.

Frontend responsibilities:

- Pages
- Layouts
- Components
- Forms
- Client-side interactions
- Routing
- UI state
- API consumption
- User experience
- Frontend validation where appropriate

Backend responsibilities:

- REST APIs
- Authentication
- Authorization
- Business logic
- Database access
- Tenant resolution
- Tenant security
- PostgreSQL RLS context
- Validation
- Transactions
- Inventory operations
- Sales operations
- Purchasing operations
- Invoicing
- Payments
- Reports
- Audit logs

Never move business logic into frontend components.

Never use frontend validation as the only validation layer.

---

# 29. Project Structure

The repository contains the Next.js application at the root and the NestJS backend inside:

```text
server/
```

The backend must remain inside the `server` directory.

Do not move the NestJS backend outside `server/`.

A high-level structure is:

```text
/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── services/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── users/
│   │   ├── customers/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── inventory/
│   │   ├── suppliers/
│   │   ├── purchases/
│   │   ├── sales/
│   │   ├── returns/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── audit-logs/
│   │   ├── settings/
│   │   ├── licenses/
│   │   ├── common/
│   │   └── ...
│   │
│   └── ...
│
├── .agents/
│   └── skills/
│       └── neon-postgres/
│
└── AGENTS.md
```

The exact existing project structure takes precedence over this conceptual structure.

Before creating new directories, inspect the repository and follow existing conventions.

Do not reorganize the project unnecessarily.

---

# 30. Tech Stack

## Frontend

- Next.js
- React
- TypeScript/JavaScript according to the existing project configuration
- TailwindCSS according to the existing project configuration
- Existing UI/component libraries in the project

Do not introduce additional frontend frameworks unless explicitly requested.

## Backend

- NestJS
- TypeScript

NestJS is the dedicated backend framework.

Do not replace NestJS with:

- Express
- Fastify directly
- Node.js custom HTTP server
- Next.js API routes

unless explicitly requested.

NestJS should follow its standard modular architecture.

---

# 31. Backend NestJS Architecture

Organize backend functionality around domain modules.

Example:

```text
server/src/

auth/
tenants/
users/
customers/
products/
categories/
inventory/
suppliers/
purchases/
sales/
returns/
invoices/
payments/
reports/
notifications/
audit-logs/
settings/
licenses/
```

Each domain module should follow appropriate NestJS patterns.

Where appropriate:

```text
module
├── controller
├── service
├── dto
├── entities/models
├── guards
├── decorators
└── ...
```

Do not create unnecessary layers simply for abstraction.

Use services for business logic.

Keep controllers thin.

Controllers should primarily:

- Receive requests
- Validate input through DTOs/pipes
- Resolve authenticated context
- Call services
- Return responses

Business logic belongs in services/domain logic.

---

# 32. Database

Database:

**PostgreSQL**

The database is a critical security boundary.

The schema must be designed for:

- Multi-tenancy
- Referential integrity
- Transactions
- Indexing
- Data consistency
- Scalability
- Tenant isolation

Use foreign keys where appropriate.

Use unique constraints where appropriate.

Use indexes based on actual query patterns.

Avoid unnecessary duplication.

Normalize relational data appropriately.

---

# 33. PostgreSQL Row-Level Security

PostgreSQL RLS is a mandatory security mechanism.

Tenant-owned tables should use tenant-aware policies.

The application must establish the current tenant context correctly before querying tenant-protected data.

RLS should prevent accidental cross-tenant access even if application code contains a tenant filtering mistake.

Before implementing database features that involve tenant isolation, read:

```text
.agents/skills/neon-postgres
```

Follow the skill's instructions for:

- PostgreSQL
- Neon
- RLS
- Database schema
- Queries
- Transactions
- Indexes
- Migrations
- Tenant isolation
- Database security

Do not invent an alternative database workflow when the skill already provides one.

---

# 34. Required Project Skill

The only project skill to use is:

```text
.agents/skills/neon-postgres
```

Before implementing database-related functionality:

1. Read the skill.
2. Understand its instructions.
3. Follow its recommended patterns.
4. Inspect the existing database implementation.
5. Reuse existing conventions.

Do not invent or introduce additional project skills.

Do not create fake skills.

Do not assume a skill exists unless it is actually present in the repository.

---

# 35. Tenant Context

Every tenant-aware request must have a reliable tenant context.

The backend should determine the tenant from trusted server-side authentication/authorization context.

Never accept:

```text
tenantId
```

from the frontend and blindly use it for authorization.

If a request contains a tenant ID, it must be validated against the authenticated user's permitted tenant context.

The tenant context must be propagated to database operations in a secure and consistent way so PostgreSQL RLS can enforce access.

---

# 36. Database Transaction Rules

Business operations that modify multiple related records should use database transactions where required.

Examples:

## Sale

```text
Create Sale
   +
Create Sale Items
   +
Create Payment
   +
Create Invoice
   +
Update Inventory
   +
Create Stock Movements
```

These operations should be designed so that a partial failure does not leave the database in an inconsistent state.

## Purchase

```text
Create Purchase
   +
Create Purchase Items
   +
Receive Purchase
   +
Update Inventory
   +
Create Stock Movements
```

## Return

```text
Create Return
   +
Create Return Items
   +
Update Inventory
   +
Create Stock Movement
   +
Create Refund/Payment Adjustment
```

Use transactions whenever atomicity is required.

---

# 37. Inventory Integrity

Inventory is business-critical.

Never update stock casually from multiple unrelated locations.

Centralize inventory-changing business logic.

Every stock change must have a reason/reference.

Examples:

```text
SALE
PURCHASE
RETURN
ADJUSTMENT
DAMAGE
```

Avoid directly modifying stock quantities from controllers.

Prefer a dedicated inventory service/domain operation.

Concurrency must be considered when multiple employees can sell or receive the same product simultaneously.

---

# 38. Sales Integrity

A confirmed sale should:

1. Validate the customer where applicable.
2. Validate products.
3. Validate quantities.
4. Validate pricing rules.
5. Verify sufficient inventory.
6. Create the sale.
7. Create sale items.
8. Update inventory.
9. Create stock movements.
10. Record payment where applicable.
11. Generate the invoice.
12. Create audit information where appropriate.

These operations must preserve data consistency.

---

# 39. Purchasing Integrity

A purchase should:

1. Validate the supplier.
2. Validate products.
3. Validate quantities.
4. Record purchase prices.
5. Confirm/receive the purchase.
6. Update inventory when received.
7. Create stock movements.
8. Maintain purchase history.

Do not increase stock simply because a draft purchase order exists.

---

# 40. API Architecture

NestJS is the single source of truth for backend business logic.

All ERP APIs belong inside:

```text
server/
```

Do not create ERP business API routes inside Next.js unless explicitly requested.

The API should be organized around domain resources.

Examples:

```text
/api/auth
/api/tenants
/api/users
/api/customers
/api/products
/api/categories
/api/inventory
/api/suppliers
/api/purchases
/api/sales
/api/returns
/api/invoices
/api/payments
/api/reports
/api/notifications
/api/audit-logs
/api/settings
/api/licenses
```

The exact route structure should follow the existing project conventions.

Controllers should remain thin.

Business logic belongs in services.

Database operations should not be scattered throughout controllers.

---

# 41. DTOs & Validation

NestJS DTOs should be used for request validation.

Validate:

- Required fields
- Data types
- String lengths
- Numeric ranges
- IDs
- Enumerations
- Business constraints where appropriate

Never trust client-provided data.

Validation must occur on the backend even if the frontend performs validation.

---

# 42. Error Handling

APIs should return meaningful and consistent errors.

Do not expose:

- Database errors
- Stack traces
- Internal implementation details
- Secrets
- Sensitive information

Example:

```json
{
  "success": false,
  "message": "Product not found."
}
```

Use NestJS exception handling appropriately.

Errors should be useful for the frontend while remaining safe.

---

# 43. Security

Security is a first-class requirement.

Never expose:

- Database credentials
- DATABASE_URL
- JWT secrets
- Private keys
- Internal tokens
- Server-only environment variables
- Sensitive database details

Never trust:

- Client user IDs
- Client tenant IDs
- Client roles
- Client permissions
- Client ownership claims

Always validate authentication and authorization on the backend.

Always enforce tenant isolation.

Always use PostgreSQL RLS for tenant-protected data.

Validate all inputs.

Use appropriate password hashing/authentication mechanisms already present in the project.

Do not modify authentication architecture unless explicitly requested.

---

# 44. Frontend Security

Frontend checks are not security mechanisms.

For example:

```text
if (user.role === "admin") {
   show button
}
```

is only a UI convenience.

The backend must independently enforce:

- Authentication
- Tenant membership
- Permissions
- Resource access

A malicious client must not be able to bypass permissions by calling the API directly.

---

# 45. UI Architecture

The ERP should provide a professional business dashboard experience.

The main application should generally contain:

- Sidebar navigation
- Header
- Breadcrumbs where appropriate
- Page content
- Tables
- Filters
- Search
- Forms
- Modals
- Confirmation dialogs
- Toast/notification feedback
- Loading states
- Empty states
- Error states

Prioritize:

- Clear information hierarchy
- Responsive design
- Accessibility
- Consistent spacing
- Reusable components
- Consistent interaction patterns
- Professional enterprise UI

Do not create completely different UI patterns for every page.

Reuse established components and patterns.

---

# 46. ERP Navigation

The tenant application should generally provide navigation for:

```text
Dashboard

Customers

Products
  └── Categories

Inventory
  └── Stock Movements

Suppliers

Purchasing

Sales
  └── Returns

Invoices

Payments

Reports

Employees

Roles & Permissions

Notifications

Audit Logs

Settings
```

The exact navigation structure may evolve as implementation progresses.

Do not create unnecessary routes.

---

# 47. Feature Boundaries

The following are intentionally outside the current scope:

- Ecommerce
- Online storefront
- Shopping cart
- Online checkout
- Online customer accounts
- Online ordering
- Marketplace
- Subscription billing
- Complex accounting
- Payroll
- HR management
- Manufacturing
- Advanced warehouse management
- Complex CRM
- Complex supply-chain management

Do not implement these unless explicitly requested.

The goal is a **minimal but professional physical retail ERP** suitable for a portfolio project.

---

# 48. Prompt Workflow

For every implementation request:

1. Read `AGENTS.md`.
2. Read the required project skill when relevant.
3. Inspect the existing implementation.
4. Understand the current architecture.
5. Reuse existing patterns whenever possible.
6. Identify meaningful ambiguities.
7. Ask a focused question only when necessary.
8. Create a detailed implementation prompt inside:

```text
prompts/
```

9. Save the prompt.

10. Ask:

```text
I prepared the implementation prompt at prompts/<feature>.md.
Is this good to execute?
```

12. On approval re read approved prompt file in the prompts/ and implement it strictly. Wait for approval.

13. Implement the feature strictly according to the approved prompt.

14. Run available checks.

15. Report exactly what was implemented and tested.

Never begin implementation before creating the prompt unless the user explicitly asks to skip prompt generation.

---

# 49. Prompt Files

Every implementation should have a corresponding prompt.

Examples:

```text
prompts/authentication.md

prompts/tenant-management.md

prompts/rbac.md

prompts/customer-management.md

prompts/product-management.md

prompts/inventory.md

prompts/suppliers.md

prompts/purchasing.md

prompts/sales.md

prompts/sales-returns.md

prompts/invoicing.md

prompts/payments.md

prompts/reports.md
```

Each prompt should contain:

- Goal
- Skills Read
- Existing Code Inspected
- Product Context
- Architecture Decisions
- Database Changes
- API Changes
- Frontend Changes
- Security Requirements
- Tenant Isolation Requirements
- Assumptions
- Files Likely To Change
- Implementation Plan
- Acceptance Criteria
- Checks To Run
- Manual Testing Steps

UI tasks must additionally include:

- Visual Layout
- Typography
- Spacing
- Responsive Behavior
- Loading States
- Empty States
- Error States
- Interaction States
- Accessibility
- Expected User Experience

Database tasks must additionally include:

- Schema Changes
- Relations
- Indexes
- Constraints
- Tenant Isolation
- RLS Policies
- Transaction Requirements
- Migration Requirements

---

# 50. Existing Code First

Before creating new code:

1. Inspect the repository.
2. Inspect the relevant module.
3. Inspect existing components.
4. Inspect existing services.
5. Inspect existing database schema.
6. Inspect existing API patterns.
7. Inspect existing authentication/authorization.
8. Reuse existing abstractions where appropriate.

Do not duplicate functionality that already exists.

Do not refactor unrelated code.

Do not introduce a new pattern when an established project pattern already exists unless there is a strong reason.

---

# 51. Avoid Overengineering

This is a portfolio project intended to demonstrate professional engineering practices.

Prioritize:

- Simple architecture
- Strong security
- Clear domain boundaries
- Maintainability
- Scalability where appropriate
- Reusable code

Do not add unnecessary:

- Microservices
- Event buses
- Message brokers
- Complex caching systems
- Kubernetes
- Distributed systems
- CQRS
- Event sourcing
- Complex domain abstractions

unless explicitly requested.

A well-designed modular monolith is preferred for the current scope.

---

# 52. Backend Modularity

NestJS should be structured as a modular monolith.

Each business domain should have a clear module boundary.

For example:

```text
customers/
products/
inventory/
suppliers/
purchases/
sales/
returns/
invoices/
payments/
reports/
```

Modules should communicate through clear services/interfaces.

Avoid tightly coupling unrelated modules.

For example:

```text
Sales
  ↓
Inventory Service
```

is preferable to allowing the Sales controller to directly manipulate inventory database tables.

---

# 53. Business Rules

Business rules belong in the backend.

Examples:

- A sale cannot sell unavailable stock.
- A purchase can increase stock only when received.
- A return must reference a valid original sale.
- A customer cannot belong to another tenant.
- A product cannot belong to another tenant.
- A supplier cannot be used by another tenant.
- An invoice cannot belong to another tenant.
- A payment cannot be applied to another tenant's invoice.
- An employee cannot access another tenant.
- Tenant RLS must prevent cross-tenant database access.

Never implement critical business rules only in the frontend.

---

# 54. Data Relationships

Important relationships include:

```text
Tenant
 ├── Users
 ├── Customers
 ├── Products
 ├── Categories
 ├── Suppliers
 ├── Purchases
 ├── Inventory
 ├── Sales
 ├── Returns
 ├── Invoices
 ├── Payments
 ├── Notifications
 ├── Audit Logs
 └── Settings
```

Example sales relationship:

```text
Customer
   ↓
Sale
   ↓
Sale Items
   ↓
Products
   ↓
Inventory
```

Example purchasing relationship:

```text
Supplier
   ↓
Purchase
   ↓
Purchase Items
   ↓
Products
   ↓
Inventory
```

Use relational integrity instead of duplicating data.

---

# 55. Database Rules

Database changes must be carefully designed.

Prefer:

- Foreign keys
- Unique constraints
- Check constraints where appropriate
- Proper indexes
- Transactions
- Normalized relations
- Tenant-aware uniqueness
- RLS policies

Every tenant-owned table should be evaluated for:

```text
tenant_id
```

and appropriate RLS protection.

Avoid unnecessary duplication.

Do not store derived data unless there is a clear performance/business reason.

---

# 56. Tenant-Aware Uniqueness

When a value should be unique for each organization, enforce uniqueness within the tenant.

For example:

```text
tenant_id + sku
```

rather than:

```text
sku
```

globally.

Other tenant-scoped unique values may include:

- SKU
- Invoice number
- Customer code
- Supplier code
- Employee code

The exact constraints should follow the business requirements.

---

# 57. Auditability

Important financial and inventory records should not be casually deleted.

For business-critical records such as:

- Sales
- Purchases
- Invoices
- Payments
- Stock movements

prefer status changes, cancellation, reversal, or correction workflows over destructive deletion where appropriate.

Historical business records should remain traceable.

---

# 58. API Response Consistency

Use consistent API response patterns across the backend.

Example success:

```json
{
  "success": true,
  "data": {}
}
```

Example failure:

```json
{
  "success": false,
  "message": "Product not found."
}
```

Follow existing project conventions if they differ.

Do not introduce multiple competing response formats unnecessarily.

---

# 59. Environment Variables

Environment variables containing secrets must remain server-side.

Examples:

```text
DATABASE_URL
```

and other secrets must never be exposed to browser code.

Only explicitly public variables may be exposed through the frontend.

Never commit secrets to the repository.

---

# 60. Testing

When tests exist, preserve and extend them.

Important areas to test include:

- Authentication
- Authorization
- Tenant isolation
- RLS
- Customer operations
- Product operations
- Inventory operations
- Purchasing
- Sales
- Returns
- Invoicing
- Payments
- Reports

Tenant isolation is especially important.

Test scenarios such as:

```text
Tenant A user
    ↓
Attempts to access Tenant B customer
    ↓
ACCESS DENIED
```

and:

```text
Tenant A user
    ↓
Queries Tenant A products
    ↓
ACCESS ALLOWED
```

Do not claim tests passed unless they were actually executed.

---

# 61. Checks

Run available project checks after implementation.

At minimum, inspect the available scripts in:

```text
package.json
```

and:

```text
server/package.json
```

Run relevant:

- Lint
- Type checking
- Unit tests
- Integration tests
- Build

Run frontend checks for frontend changes.

Run backend checks for backend changes.

Run database/migration checks for database changes.

Run build checks whenever configuration, routing, middleware, authentication, or major server modules change.

Never claim a command passed unless it was actually executed.

/
├── login
├── forgot-password
│
├── dashboard
├── customers
│ └── [customerId]
├── products
│ └── [productId]
├── categories
├── inventory
│ └── movements
├── suppliers
│ └── [supplierId]
├── purchases
│ ├── new
│ └── [purchaseId]
├── sales
│ ├── new
│ └── [saleId]
├── returns
│ ├── new
│ └── [returnId]
├── invoices
│ └── [invoiceId]
├── payments
│ └── [paymentId]
├── reports
├── employees
│ └── [employeeId]
├── roles
│ └── [roleId]
├── notifications
├── audit-logs
│
├── settings
│ ├── company
│ ├── invoice
│ ├── tax
│ └── profile
│
└── admin
└── tenants
├── new
└── [tenantId]

---

# 62. Manual Testing

After implementation, provide exact manual testing steps.

For example:

```text
1. Login as Tenant A.
2. Create a product.
3. Create a customer.
4. Create a sale.
5. Verify inventory decreased.
6. Verify invoice was created.
7. Verify payment was recorded.
8. Login as Tenant B.
9. Attempt to access Tenant A data.
10. Verify access is denied.
```

For every feature, provide practical verification steps.

---

# 63. Implementation Rules

Before implementing any feature:

1. Read `AGENTS.md`.
2. Read the required skill when relevant.
3. Inspect the existing implementation.
4. Understand the existing architecture.
5. Reuse existing code whenever possible.
6. Create a detailed prompt inside `prompts/`.
7. Ask for approval.
8. Wait for approval.
9. Re-read the approved prompt.
10. Implement only the requested feature.
11. Preserve tenant isolation.
12. Preserve existing architecture.
13. Run relevant checks.
14. Provide manual testing steps.

Do not skip the approval workflow unless the user explicitly asks to skip it.

---

# 64. Security Rules

Security must always take priority over convenience.

Never:

- Trust client-provided tenant IDs.
- Trust client-provided roles.
- Trust client-provided permissions.
- Bypass backend authorization.
- Disable RLS for convenience.
- Query tenant data without tenant context.
- Expose database credentials.
- Expose server secrets.
- Return internal stack traces.
- Allow cross-tenant relationships.
- Modify historical business records without an appropriate workflow.

Always:

- Authenticate users.
- Authorize users.
- Resolve tenant context securely.
- Enforce tenant isolation.
- Use PostgreSQL RLS.
- Validate input.
- Use transactions for critical operations.
- Maintain auditability.

---

# 65. Performance

Prioritize sensible performance without premature optimization.

Use:

- Proper database indexes
- Pagination for large lists
- Server-side filtering where appropriate
- Efficient queries
- Database transactions
- Proper relation loading
- Avoid unnecessary API calls
- Avoid unnecessary frontend renders

Do not introduce caching unless there is an actual requirement.

Do not optimize blindly.

Measure or inspect the actual bottleneck before introducing complexity.

---

# 66. Code Quality

Write code that another senior engineer can understand easily.

Prioritize:

- Clear naming
- Small focused functions
- Reusable components
- Reusable services
- Strong typing
- Consistent error handling
- Clear module boundaries
- Minimal duplication
- Meaningful comments only where necessary

Avoid:

- Giant controllers
- Giant services
- Giant React components
- Deep unnecessary abstractions
- Copy-pasted business logic
- Magic values
- Unclear naming

---

# 67. Frontend Rules

The frontend should consume the NestJS backend APIs.

Do not duplicate backend business logic inside Next.js.

Frontend responsibilities include:

- Rendering
- Forms
- User interaction
- Navigation
- API calls
- UI state
- Loading states
- Error states
- Empty states

The frontend must never be treated as the security boundary.

---

# 68. Backend Rules

NestJS is the authoritative backend.

Backend responsibilities include:

- Authentication
- Authorization
- Tenant resolution
- Business logic
- Validation
- Database access
- Transactions
- Inventory operations
- Sales operations
- Purchasing
- Invoices
- Payments
- Reports
- Audit logs

Keep controllers thin.

Keep business logic in services.

Keep database logic organized and maintainable.

---

# 69. Feature Scope Rule

When the user asks for a specific feature:

Implement only that feature and the minimum supporting changes required for it to work correctly.

Do not automatically implement:

- Future modules
- Unrequested refactors
- Ecommerce
- Subscription billing
- Advanced accounting
- Unrequested infrastructure
- Unrequested third-party integrations

If a requested feature requires a dependency or architectural change, explain it and include it in the implementation prompt.

---

# 70. Final Development Principles

Always prioritize:

- **Tenant isolation**
- **Security**
- **Data integrity**
- **Simplicity**
- **Scalability**
- **Maintainability**
- **Readability**
- **Performance**
- **Reusable architecture**
- **Professional UX**
- **Strong backend business logic**

The most important architectural principle of this project is:

> **A tenant must never be able to access another tenant's data, even if application code accidentally contains a tenant-filtering mistake. PostgreSQL RLS must provide the database-level security boundary.**

The second most important principle is:

> **Business-critical operations such as sales, purchases, returns, inventory updates, invoices, and payments must preserve transactional consistency and historical traceability.**

Build the system as a **secure, modular, production-style multi-tenant ERP**, while keeping the implementation appropriately simple for a portfolio project.

Never over-engineer.

Never implement unrelated functionality.

Never compromise tenant isolation for convenience.

Never bypass the established architecture without explicit approval.
