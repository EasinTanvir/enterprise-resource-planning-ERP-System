import DomainForm from "@/components/domain-form";
export default async function ReceivePurchasePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="purchase" action="receive" subdomain={subdomain} />;
}
