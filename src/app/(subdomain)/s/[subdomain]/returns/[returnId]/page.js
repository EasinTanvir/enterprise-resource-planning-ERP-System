import ErpPage from "@/components/erp-page";
export default async function ReturnDetailPage({ params }) {
  const { subdomain, returnId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="returns" detailId={returnId} />
  );
}
