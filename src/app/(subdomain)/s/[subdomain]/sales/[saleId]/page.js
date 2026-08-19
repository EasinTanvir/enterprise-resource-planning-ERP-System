import ErpPage from "@/components/erp-page";
export default async function SaleDetailPage({ params }) {
  const { subdomain, saleId } = await params;
  return <ErpPage subdomain={subdomain} section="sales" detailId={saleId} />;
}
