import ErpPage from "@/components/erp-page";
export default async function RolesPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="roles" />;
}
