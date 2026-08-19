import ErpPage from "@/components/erp-page";
export default async function MovementsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="inventory" />;
}
