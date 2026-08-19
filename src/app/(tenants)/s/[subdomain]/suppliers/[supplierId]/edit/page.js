import DomainForm from "@/components/domain-form";
export default async function EditSupplierPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="suppliers" mode="edit" subdomain={subdomain} />;
}
