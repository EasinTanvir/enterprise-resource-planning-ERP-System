import DomainForm from "@/components/domain-form";
export default async function EditPurchasePage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="purchase" mode="edit" subdomain={subdomain} />;
}
