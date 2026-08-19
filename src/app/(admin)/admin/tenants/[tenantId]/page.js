import AdminPage from "@/components/admin-page";
export default async function AdminTenantDetailPage({ params }) {
  const { tenantId } = await params;
  return <AdminPage mode="detail" tenantId={tenantId} />;
}
