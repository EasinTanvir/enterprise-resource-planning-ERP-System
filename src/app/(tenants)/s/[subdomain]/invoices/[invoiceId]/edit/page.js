import DomainForm from "@/components/domain-form";
export default async function EditInvoicePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="invoice" mode="edit" subdomain={subdomain} />;
}
