import DomainForm from "@/components/domain-form";
export default async function EditReturnPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="return" mode="edit" subdomain={subdomain} />;
}
