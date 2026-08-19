import DomainForm from "@/components/domain-form";
export default async function NewSupplierPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="suppliers" subdomain={subdomain} />;
}
