import ErpPage from "@/components/erp-page";
export default async function InvoicesPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="invoices" />;
}
