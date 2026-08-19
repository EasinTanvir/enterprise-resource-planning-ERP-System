import ErpPage from "@/components/erp-page";
export default async function NewPurchasePage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="purchases" form />;
}
