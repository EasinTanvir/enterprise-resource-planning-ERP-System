import ErpPage from "@/components/erp-page";
export default async function SalesPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="sales" />;
}
