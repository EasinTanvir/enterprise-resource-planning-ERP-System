import ErpPage from "@/components/erp-page";
export default async function CustomerDetailPage({ params }) {
  const { subdomain, customerId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="customers" detailId={customerId} />
  );
}
