-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint

-- RLS denies access by default because the transaction-local setting is empty
-- unless trusted backend code calls TenantTransactionService.withTenant().
DO $$
DECLARE
  tenant_table text;
BEGIN
  FOREACH tenant_table IN ARRAY ARRAY[
    'tenant_licenses', 'tenant_memberships', 'roles', 'membership_roles',
    'categories', 'products', 'customers', 'suppliers', 'company_settings',
    'inventory_balances', 'stock_movements', 'purchases', 'purchase_items',
    'sales', 'sale_items', 'invoices', 'payments', 'sales_returns',
    'sales_return_items', 'notifications', 'audit_logs'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tenant_table);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', tenant_table);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON public.%I FOR ALL TO PUBLIC USING (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')::uuid) WITH CHECK (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')::uuid)',
      tenant_table
    );
  END LOOP;

  ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.tenants FORCE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation ON public.tenants FOR ALL TO PUBLIC
    USING (id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid)
    WITH CHECK (id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
END $$;--> statement-breakpoint

-- Composite foreign keys prevent a tenant-scoped record from referencing a
-- different tenant's parent, independently of application-level filters.
ALTER TABLE public.products ADD CONSTRAINT products_tenant_category_fk FOREIGN KEY (tenant_id, category_id) REFERENCES public.categories(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.inventory_balances ADD CONSTRAINT inventory_balances_tenant_product_fk FOREIGN KEY (tenant_id, product_id) REFERENCES public.products(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.stock_movements ADD CONSTRAINT stock_movements_tenant_product_fk FOREIGN KEY (tenant_id, product_id) REFERENCES public.products(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.purchases ADD CONSTRAINT purchases_tenant_supplier_fk FOREIGN KEY (tenant_id, supplier_id) REFERENCES public.suppliers(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.purchase_items ADD CONSTRAINT purchase_items_tenant_purchase_fk FOREIGN KEY (tenant_id, purchase_id) REFERENCES public.purchases(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.purchase_items ADD CONSTRAINT purchase_items_tenant_product_fk FOREIGN KEY (tenant_id, product_id) REFERENCES public.products(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.sales ADD CONSTRAINT sales_tenant_customer_fk FOREIGN KEY (tenant_id, customer_id) REFERENCES public.customers(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.sale_items ADD CONSTRAINT sale_items_tenant_sale_fk FOREIGN KEY (tenant_id, sale_id) REFERENCES public.sales(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.sale_items ADD CONSTRAINT sale_items_tenant_product_fk FOREIGN KEY (tenant_id, product_id) REFERENCES public.products(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.invoices ADD CONSTRAINT invoices_tenant_sale_fk FOREIGN KEY (tenant_id, sale_id) REFERENCES public.sales(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.payments ADD CONSTRAINT payments_tenant_invoice_fk FOREIGN KEY (tenant_id, invoice_id) REFERENCES public.invoices(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.payments ADD CONSTRAINT payments_tenant_sale_fk FOREIGN KEY (tenant_id, sale_id) REFERENCES public.sales(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.sales_returns ADD CONSTRAINT sales_returns_tenant_sale_fk FOREIGN KEY (tenant_id, sale_id) REFERENCES public.sales(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.sales_returns ADD CONSTRAINT sales_returns_tenant_customer_fk FOREIGN KEY (tenant_id, customer_id) REFERENCES public.customers(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.membership_roles ADD CONSTRAINT membership_roles_tenant_membership_fk FOREIGN KEY (tenant_id, membership_id) REFERENCES public.tenant_memberships(tenant_id, id) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE public.membership_roles ADD CONSTRAINT membership_roles_tenant_role_fk FOREIGN KEY (tenant_id, role_id) REFERENCES public.roles(tenant_id, id) ON DELETE RESTRICT;
