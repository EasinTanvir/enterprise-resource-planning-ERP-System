import DomainForm from "@/components/domain-form";
export default async function EditPaymentPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="payment" mode="edit" subdomain={subdomain} />;
}
