import ErpPage from "@/components/erp-page";
export default async function PurchaseDetailPage({ params }) {
  const { subdomain, purchaseId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="purchases" detailId={purchaseId} />
  );
}
