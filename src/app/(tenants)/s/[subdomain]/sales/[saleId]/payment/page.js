import DomainForm from "@/components/domain-form";
export default async function SalePaymentPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="payment" subdomain={subdomain} />;
}
