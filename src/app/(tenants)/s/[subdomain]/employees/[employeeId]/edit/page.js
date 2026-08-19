import DomainForm from "@/components/domain-form";
export default async function EditEmployeePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="employees" mode="edit" subdomain={subdomain} />;
}
