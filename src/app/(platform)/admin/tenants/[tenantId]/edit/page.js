import DomainForm from "@/components/domain-form";
export default async function EditPlatformTenantPage({ params }) {
  await params;
  return <DomainForm type="company" mode="edit" />;
}
