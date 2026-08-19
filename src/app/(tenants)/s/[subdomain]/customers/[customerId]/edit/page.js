import DomainForm from "@/components/domain-form";
export default async function EditCustomerPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="customers" mode="edit" subdomain={subdomain} />;
}
