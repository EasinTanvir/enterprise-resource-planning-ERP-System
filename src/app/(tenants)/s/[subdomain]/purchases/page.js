import ErpPage from "@/components/erp-page";
export default async function PurchasesPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="purchases" />;
}
