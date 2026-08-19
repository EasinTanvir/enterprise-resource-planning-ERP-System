import ErpPage from "@/components/erp-page";
export default async function InventoryPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="inventory" />;
}
