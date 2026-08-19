import ErpPage from "@/components/erp-page";
export default async function EmployeesPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="employees" />;
}
