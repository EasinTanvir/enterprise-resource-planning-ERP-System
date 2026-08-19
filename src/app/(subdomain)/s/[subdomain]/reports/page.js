import ErpPage from "@/components/erp-page";
export default async function ReportsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="reports" />;
}
