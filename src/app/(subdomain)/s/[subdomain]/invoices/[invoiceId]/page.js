import ErpPage from "@/components/erp-page";
export default async function InvoiceDetailPage({ params }) {
  const { subdomain, invoiceId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="invoices" detailId={invoiceId} />
  );
}
