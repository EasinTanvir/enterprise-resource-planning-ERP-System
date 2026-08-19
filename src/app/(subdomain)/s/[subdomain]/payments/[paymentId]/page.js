import ErpPage from "@/components/erp-page";
export default async function PaymentDetailPage({ params }) {
  const { subdomain, paymentId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="payments" detailId={paymentId} />
  );
}
