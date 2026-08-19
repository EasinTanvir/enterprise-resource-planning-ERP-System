import ErpPage from "@/components/erp-page";
export default async function EmployeeDetailPage({ params }) {
  const { subdomain, employeeId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="employees" detailId={employeeId} />
  );
}
