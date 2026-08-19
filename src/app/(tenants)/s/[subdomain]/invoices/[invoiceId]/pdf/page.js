import DomainForm from "@/components/domain-form";
export default async function InvoicePdfPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="invoice-pdf" subdomain={subdomain} />;
}
