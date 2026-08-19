import DomainForm from "@/components/domain-form";
export default async function InvoiceSettingsPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="invoice" subdomain={subdomain} />;
}
