import ErpPage from "@/components/erp-page";
export default async function SuppliersPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="suppliers" />;
}
