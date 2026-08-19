import DomainForm from "@/components/domain-form";
export default async function NewEmployeePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="employees" subdomain={subdomain} />;
}
