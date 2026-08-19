import ErpPage from "@/components/erp-page";
export default async function ReturnsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="returns" />;
}
