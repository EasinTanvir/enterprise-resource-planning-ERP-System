import DomainForm from "@/components/domain-form";
export default async function TenantAdministratorsPage({ params }) {
  await params;
  return <DomainForm type="administrator" />;
}
