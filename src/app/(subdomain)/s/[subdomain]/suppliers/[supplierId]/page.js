import ErpPage from "@/components/erp-page";
export default async function SupplierDetailPage({ params }) {
  const { subdomain, supplierId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="suppliers" detailId={supplierId} />
  );
}
