import ErpPage from "@/components/erp-page";
export default async function PaymentsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="payments" />;
}
