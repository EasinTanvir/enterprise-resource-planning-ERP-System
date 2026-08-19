import DomainForm from "@/components/domain-form";
export default async function NewCustomerPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="customers" subdomain={subdomain} />;
}
