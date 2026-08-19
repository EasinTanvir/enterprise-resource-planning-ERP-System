import DomainForm from "@/components/domain-form";
export default async function TenantLicensePage({ params }) {
  await params;
  return <DomainForm type="license" />;
}
