import DomainForm from "@/components/domain-form";
export default async function EditRolePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="roles" mode="edit" subdomain={subdomain} />;
}
