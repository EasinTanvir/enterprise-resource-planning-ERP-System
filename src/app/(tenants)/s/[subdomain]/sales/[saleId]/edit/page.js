import DomainForm from "@/components/domain-form";
export default async function EditSalePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="sale" mode="edit" subdomain={subdomain} />;
}
