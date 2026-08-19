import ErpPage from "@/components/erp-page";

export default async function CustomerPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="customers" />;
}
