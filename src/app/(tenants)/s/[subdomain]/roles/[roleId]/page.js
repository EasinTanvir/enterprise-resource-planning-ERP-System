import ErpPage from "@/components/erp-page";
export default async function RoleDetailPage({ params }) {
  const { subdomain, roleId } = await params;
  return <ErpPage subdomain={subdomain} section="roles" detailId={roleId} />;
}
