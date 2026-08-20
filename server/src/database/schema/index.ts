import {
  boolean,
  check,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const auditColumns = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
};
const money = (name: string) => numeric(name, { precision: 14, scale: 2 });
const quantity = (name: string) => numeric(name, { precision: 14, scale: 3 });

export const tenantStatusEnum = pgEnum('tenant_status', [
  'active',
  'suspended',
]);
export const licenseStatusEnum = pgEnum('license_status', [
  'active',
  'suspended',
  'revoked',
]);
export const membershipStatusEnum = pgEnum('membership_status', [
  'invited',
  'active',
  'inactive',
]);
export const recordStatusEnum = pgEnum('record_status', ['active', 'inactive']);
export const purchaseStatusEnum = pgEnum('purchase_status', [
  'draft',
  'confirmed',
  'partially_received',
  'received',
  'cancelled',
]);
export const saleStatusEnum = pgEnum('sale_status', [
  'draft',
  'confirmed',
  'cancelled',
]);
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'issued',
  'void',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
  'void',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'card',
  'bank_transfer',
  'mobile_banking',
  'other',
]);
export const returnStatusEnum = pgEnum('return_status', [
  'pending',
  'approved',
  'rejected',
  'refunded',
]);
export const movementTypeEnum = pgEnum('stock_movement_type', [
  'purchase',
  'sale',
  'return',
  'adjustment',
  'damage',
  'opening_balance',
]);
export const authProviderEnum = pgEnum('auth_provider', [
  'credentials',
  'google',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 320 }).notNull(),
    passwordHash: text('password_hash'),
    firstName: varchar('first_name', { length: 120 }).notNull(),
    lastName: varchar('last_name', { length: 120 }).notNull(),
    phone: varchar('phone', { length: 40 }),
    isPlatformAdmin: boolean('is_platform_admin').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    ...auditColumns,
  },
  (t) => [uniqueIndex('users_email_unique').on(t.email)],
);
export const userAuthAccounts = pgTable(
  'user_auth_accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    provider: authProviderEnum('provider').notNull(),
    providerAccountId: varchar('provider_account_id', {
      length: 320,
    }).notNull(),
    providerEmail: varchar('provider_email', { length: 320 }),
    ...auditColumns,
  },
  (t) => [
    unique('user_auth_accounts_provider_account_unique').on(
      t.provider,
      t.providerAccountId,
    ),
    unique('user_auth_accounts_user_provider_unique').on(t.userId, t.provider),
    index('user_auth_accounts_user_idx').on(t.userId),
  ],
);
export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    status: tenantStatusEnum('status').notNull().default('active'),
    email: varchar('email', { length: 320 }),
    phone: varchar('phone', { length: 40 }),
    address: text('address'),
    ...auditColumns,
  },
  (t) => [
    uniqueIndex('tenants_slug_unique').on(t.slug),
    unique('tenants_id_unique').on(t.id),
  ],
);
export const tenantLicenses = pgTable(
  'tenant_licenses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    status: licenseStatusEnum('status').notNull().default('active'),
    activatedAt: timestamp('activated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    suspendedAt: timestamp('suspended_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    notes: text('notes'),
    ...auditColumns,
  },
  (t) => [uniqueIndex('tenant_licenses_tenant_unique').on(t.tenantId)],
);
export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    key: varchar('key', { length: 150 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex('permissions_key_unique').on(t.key)],
);
export const tenantMemberships = pgTable(
  'tenant_memberships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    employeeCode: varchar('employee_code', { length: 80 }),
    status: membershipStatusEnum('status').notNull().default('invited'),
    ...auditColumns,
  },
  (t) => [
    unique('tenant_memberships_tenant_user_unique').on(t.tenantId, t.userId),
    unique('tenant_memberships_tenant_id_unique').on(t.tenantId, t.id),
    uniqueIndex('tenant_memberships_employee_code_unique').on(
      t.tenantId,
      t.employeeCode,
    ),
    index('tenant_memberships_tenant_user_idx').on(t.tenantId, t.userId),
  ],
);
export const roles = pgTable(
  'roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 120 }).notNull(),
    description: text('description'),
    isSystem: boolean('is_system').notNull().default(false),
    ...auditColumns,
  },
  (t) => [
    unique('roles_tenant_id_unique').on(t.tenantId, t.id),
    unique('roles_tenant_name_unique').on(t.tenantId, t.name),
    index('roles_tenant_idx').on(t.tenantId),
  ],
);
export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'restrict' }),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);
export const membershipRoles = pgTable(
  'membership_roles',
  {
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    membershipId: uuid('membership_id')
      .notNull()
      .references(() => tenantMemberships.id, { onDelete: 'restrict' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),
  },
  (t) => [
    primaryKey({ columns: [t.membershipId, t.roleId] }),
    index('membership_roles_tenant_idx').on(t.tenantId),
  ],
);
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    parentId: uuid('parent_id'),
    name: varchar('name', { length: 160 }).notNull(),
    description: text('description'),
    status: recordStatusEnum('status').notNull().default('active'),
    ...auditColumns,
  },
  (t) => [
    unique('categories_tenant_id_unique').on(t.tenantId, t.id),
    unique('categories_tenant_name_unique').on(t.tenantId, t.name),
    index('categories_tenant_parent_idx').on(t.tenantId, t.parentId),
  ],
);
export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    categoryId: uuid('category_id'),
    sku: varchar('sku', { length: 120 }).notNull(),
    name: varchar('name', { length: 240 }).notNull(),
    description: text('description'),
    unit: varchar('unit', { length: 40 }).notNull().default('piece'),
    purchasePrice: money('purchase_price').notNull().default('0'),
    sellingPrice: money('selling_price').notNull().default('0'),
    reorderLevel: quantity('reorder_level').notNull().default('0'),
    imageUrl: text('image_url'),
    status: recordStatusEnum('status').notNull().default('active'),
    ...auditColumns,
  },
  (t) => [
    unique('products_tenant_id_unique').on(t.tenantId, t.id),
    unique('products_tenant_sku_unique').on(t.tenantId, t.sku),
    index('products_tenant_category_idx').on(t.tenantId, t.categoryId),
    check(
      'products_prices_non_negative',
      sql`${t.purchasePrice} >= 0 AND ${t.sellingPrice} >= 0 AND ${t.reorderLevel} >= 0`,
    ),
  ],
);
export const customers = pgTable(
  'customers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    customerCode: varchar('customer_code', { length: 80 }),
    name: varchar('name', { length: 240 }).notNull(),
    phone: varchar('phone', { length: 40 }),
    email: varchar('email', { length: 320 }),
    address: text('address'),
    status: recordStatusEnum('status').notNull().default('active'),
    ...auditColumns,
  },
  (t) => [
    unique('customers_tenant_id_unique').on(t.tenantId, t.id),
    uniqueIndex('customers_tenant_code_unique').on(t.tenantId, t.customerCode),
    index('customers_tenant_name_idx').on(t.tenantId, t.name),
  ],
);
export const suppliers = pgTable(
  'suppliers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    supplierCode: varchar('supplier_code', { length: 80 }),
    name: varchar('name', { length: 240 }).notNull(),
    phone: varchar('phone', { length: 40 }),
    email: varchar('email', { length: 320 }),
    address: text('address'),
    status: recordStatusEnum('status').notNull().default('active'),
    ...auditColumns,
  },
  (t) => [
    unique('suppliers_tenant_id_unique').on(t.tenantId, t.id),
    uniqueIndex('suppliers_tenant_code_unique').on(t.tenantId, t.supplierCode),
    index('suppliers_tenant_name_idx').on(t.tenantId, t.name),
  ],
);
export const companySettings = pgTable(
  'company_settings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    companyName: varchar('company_name', { length: 240 }).notNull(),
    logoUrl: text('logo_url'),
    email: varchar('email', { length: 320 }),
    phone: varchar('phone', { length: 40 }),
    address: text('address'),
    website: varchar('website', { length: 500 }),
    currencyCode: varchar('currency_code', { length: 3 })
      .notNull()
      .default('BDT'),
    invoicePrefix: varchar('invoice_prefix', { length: 30 })
      .notNull()
      .default('INV'),
    invoiceFooter: text('invoice_footer'),
    taxEnabled: boolean('tax_enabled').notNull().default(false),
    taxRate: numeric('tax_rate', { precision: 7, scale: 4 })
      .notNull()
      .default('0'),
    ...auditColumns,
  },
  (t) => [
    uniqueIndex('company_settings_tenant_unique').on(t.tenantId),
    check('company_settings_tax_rate_non_negative', sql`${t.taxRate} >= 0`),
  ],
);
export const inventoryBalances = pgTable(
  'inventory_balances',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    onHandQuantity: quantity('on_hand_quantity').notNull().default('0'),
    reservedQuantity: quantity('reserved_quantity').notNull().default('0'),
    availableQuantity: quantity('available_quantity').notNull().default('0'),
    ...auditColumns,
  },
  (t) => [
    uniqueIndex('inventory_balances_tenant_product_unique').on(
      t.tenantId,
      t.productId,
    ),
    check(
      'inventory_balances_non_negative',
      sql`${t.onHandQuantity} >= 0 AND ${t.reservedQuantity} >= 0 AND ${t.availableQuantity} >= 0 AND ${t.availableQuantity} = ${t.onHandQuantity} - ${t.reservedQuantity}`,
    ),
  ],
);
export const stockMovements = pgTable(
  'stock_movements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    movementType: movementTypeEnum('movement_type').notNull(),
    quantity: quantity('quantity').notNull(),
    referenceType: varchar('reference_type', { length: 80 }),
    referenceId: uuid('reference_id'),
    reason: text('reason'),
    actorUserId: uuid('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('stock_movements_tenant_product_created_idx').on(
      t.tenantId,
      t.productId,
      t.createdAt,
    ),
    index('stock_movements_tenant_type_created_idx').on(
      t.tenantId,
      t.movementType,
      t.createdAt,
    ),
    check('stock_movements_quantity_non_zero', sql`${t.quantity} <> 0`),
  ],
);
export const purchases = pgTable(
  'purchases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    supplierId: uuid('supplier_id')
      .notNull()
      .references(() => suppliers.id, { onDelete: 'restrict' }),
    purchaseNumber: varchar('purchase_number', { length: 80 }).notNull(),
    status: purchaseStatusEnum('status').notNull().default('draft'),
    purchaseDate: timestamp('purchase_date', { withTimezone: true })
      .notNull()
      .defaultNow(),
    receivedAt: timestamp('received_at', { withTimezone: true }),
    subtotal: money('subtotal').notNull().default('0'),
    discountAmount: money('discount_amount').notNull().default('0'),
    taxAmount: money('tax_amount').notNull().default('0'),
    totalAmount: money('total_amount').notNull().default('0'),
    notes: text('notes'),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...auditColumns,
  },
  (t) => [
    unique('purchases_tenant_id_unique').on(t.tenantId, t.id),
    unique('purchases_tenant_number_unique').on(t.tenantId, t.purchaseNumber),
    index('purchases_tenant_supplier_date_idx').on(
      t.tenantId,
      t.supplierId,
      t.purchaseDate,
    ),
    check(
      'purchases_totals_non_negative',
      sql`${t.subtotal} >= 0 AND ${t.discountAmount} >= 0 AND ${t.taxAmount} >= 0 AND ${t.totalAmount} >= 0`,
    ),
  ],
);
export const purchaseItems = pgTable(
  'purchase_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    purchaseId: uuid('purchase_id')
      .notNull()
      .references(() => purchases.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    orderedQuantity: quantity('ordered_quantity').notNull(),
    receivedQuantity: quantity('received_quantity').notNull().default('0'),
    unitCost: money('unit_cost').notNull(),
    discountAmount: money('discount_amount').notNull().default('0'),
    taxAmount: money('tax_amount').notNull().default('0'),
    lineTotal: money('line_total').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique('purchase_items_tenant_id_unique').on(t.tenantId, t.id),
    index('purchase_items_tenant_purchase_idx').on(t.tenantId, t.purchaseId),
    check(
      'purchase_items_values_valid',
      sql`${t.orderedQuantity} > 0 AND ${t.receivedQuantity} >= 0 AND ${t.receivedQuantity} <= ${t.orderedQuantity} AND ${t.unitCost} >= 0 AND ${t.lineTotal} >= 0`,
    ),
  ],
);
export const sales = pgTable(
  'sales',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    customerId: uuid('customer_id').references(() => customers.id, {
      onDelete: 'restrict',
    }),
    saleNumber: varchar('sale_number', { length: 80 }).notNull(),
    status: saleStatusEnum('status').notNull().default('draft'),
    subtotal: money('subtotal').notNull().default('0'),
    discountAmount: money('discount_amount').notNull().default('0'),
    taxAmount: money('tax_amount').notNull().default('0'),
    totalAmount: money('total_amount').notNull().default('0'),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancellationReason: text('cancellation_reason'),
    createdByUserId: uuid('created_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...auditColumns,
  },
  (t) => [
    unique('sales_tenant_id_unique').on(t.tenantId, t.id),
    unique('sales_tenant_number_unique').on(t.tenantId, t.saleNumber),
    index('sales_tenant_customer_created_idx').on(
      t.tenantId,
      t.customerId,
      t.createdAt,
    ),
    check(
      'sales_totals_non_negative',
      sql`${t.subtotal} >= 0 AND ${t.discountAmount} >= 0 AND ${t.taxAmount} >= 0 AND ${t.totalAmount} >= 0`,
    ),
  ],
);
export const saleItems = pgTable(
  'sale_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    saleId: uuid('sale_id')
      .notNull()
      .references(() => sales.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    productSku: varchar('product_sku', { length: 120 }).notNull(),
    productName: varchar('product_name', { length: 240 }).notNull(),
    quantity: quantity('quantity').notNull(),
    unitPrice: money('unit_price').notNull(),
    discountAmount: money('discount_amount').notNull().default('0'),
    taxAmount: money('tax_amount').notNull().default('0'),
    lineTotal: money('line_total').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique('sale_items_tenant_id_unique').on(t.tenantId, t.id),
    index('sale_items_tenant_sale_idx').on(t.tenantId, t.saleId),
    check(
      'sale_items_values_valid',
      sql`${t.quantity} > 0 AND ${t.unitPrice} >= 0 AND ${t.lineTotal} >= 0`,
    ),
  ],
);
export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    saleId: uuid('sale_id')
      .notNull()
      .references(() => sales.id, { onDelete: 'restrict' }),
    invoiceNumber: varchar('invoice_number', { length: 80 }).notNull(),
    status: invoiceStatusEnum('status').notNull().default('draft'),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    dueAt: timestamp('due_at', { withTimezone: true }),
    subtotal: money('subtotal').notNull().default('0'),
    discountAmount: money('discount_amount').notNull().default('0'),
    taxAmount: money('tax_amount').notNull().default('0'),
    totalAmount: money('total_amount').notNull().default('0'),
    paidAmount: money('paid_amount').notNull().default('0'),
    ...auditColumns,
  },
  (t) => [
    unique('invoices_tenant_id_unique').on(t.tenantId, t.id),
    unique('invoices_tenant_number_unique').on(t.tenantId, t.invoiceNumber),
    unique('invoices_tenant_sale_unique').on(t.tenantId, t.saleId),
    index('invoices_tenant_status_idx').on(t.tenantId, t.status),
    check(
      'invoices_totals_valid',
      sql`${t.subtotal} >= 0 AND ${t.totalAmount} >= 0 AND ${t.paidAmount} >= 0 AND ${t.paidAmount} <= ${t.totalAmount}`,
    ),
  ],
);
export const payments = pgTable(
  'payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    invoiceId: uuid('invoice_id').references(() => invoices.id, {
      onDelete: 'restrict',
    }),
    saleId: uuid('sale_id').references(() => sales.id, {
      onDelete: 'restrict',
    }),
    method: paymentMethodEnum('method').notNull(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    amount: money('amount').notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    providerReference: varchar('provider_reference', { length: 160 }),
    notes: text('notes'),
    recordedByUserId: uuid('recorded_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...auditColumns,
  },
  (t) => [
    index('payments_tenant_invoice_idx').on(t.tenantId, t.invoiceId),
    index('payments_tenant_sale_idx').on(t.tenantId, t.saleId),
    check('payments_amount_positive', sql`${t.amount} > 0`),
    check(
      'payments_has_reference',
      sql`${t.invoiceId} IS NOT NULL OR ${t.saleId} IS NOT NULL`,
    ),
  ],
);
export const salesReturns = pgTable(
  'sales_returns',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    saleId: uuid('sale_id')
      .notNull()
      .references(() => sales.id, { onDelete: 'restrict' }),
    customerId: uuid('customer_id').references(() => customers.id, {
      onDelete: 'restrict',
    }),
    returnNumber: varchar('return_number', { length: 80 }).notNull(),
    status: returnStatusEnum('status').notNull().default('pending'),
    reason: text('reason').notNull(),
    refundAmount: money('refund_amount').notNull().default('0'),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    approvedByUserId: uuid('approved_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    ...auditColumns,
  },
  (t) => [
    unique('sales_returns_tenant_id_unique').on(t.tenantId, t.id),
    unique('sales_returns_tenant_number_unique').on(t.tenantId, t.returnNumber),
    index('sales_returns_tenant_sale_idx').on(t.tenantId, t.saleId),
    check('sales_returns_refund_non_negative', sql`${t.refundAmount} >= 0`),
  ],
);
export const salesReturnItems = pgTable(
  'sales_return_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    salesReturnId: uuid('sales_return_id')
      .notNull()
      .references(() => salesReturns.id, { onDelete: 'restrict' }),
    saleItemId: uuid('sale_item_id')
      .notNull()
      .references(() => saleItems.id, { onDelete: 'restrict' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    quantity: quantity('quantity').notNull(),
    refundAmount: money('refund_amount').notNull(),
    conditionNotes: text('condition_notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('sales_return_items_tenant_return_idx').on(
      t.tenantId,
      t.salesReturnId,
    ),
    check(
      'sales_return_items_values_valid',
      sql`${t.quantity} > 0 AND ${t.refundAmount} >= 0`,
    ),
  ],
);
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    type: varchar('type', { length: 100 }).notNull(),
    title: varchar('title', { length: 240 }).notNull(),
    body: text('body').notNull(),
    resourceType: varchar('resource_type', { length: 80 }),
    resourceId: uuid('resource_id'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('notifications_tenant_user_created_idx').on(
      t.tenantId,
      t.userId,
      t.createdAt,
    ),
  ],
);
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    actorUserId: uuid('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    action: varchar('action', { length: 150 }).notNull(),
    resourceType: varchar('resource_type', { length: 100 }).notNull(),
    resourceId: uuid('resource_id'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('audit_logs_tenant_resource_created_idx').on(
      t.tenantId,
      t.resourceType,
      t.createdAt,
    ),
    index('audit_logs_tenant_actor_created_idx').on(
      t.tenantId,
      t.actorUserId,
      t.createdAt,
    ),
  ],
);
