import DomainForm from "@/components/domain-form";
export default async function NewRolePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="roles" subdomain={subdomain} />;
}
