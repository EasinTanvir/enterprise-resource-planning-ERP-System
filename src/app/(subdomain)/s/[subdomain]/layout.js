import { TenantShell } from "@/components/erp-shell";
import { getTenant } from "@/lib/erp-data";

export default async function TenantLayout({ children, params }) {
  const { subdomain } = await params;
  const tenant = getTenant(subdomain);
  return (
    <TenantShell subdomain={subdomain} tenantName={tenant.name}>
      {children}
    </TenantShell>
  );
}
