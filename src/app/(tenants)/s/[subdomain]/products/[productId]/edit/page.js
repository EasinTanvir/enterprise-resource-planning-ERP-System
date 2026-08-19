import DomainForm from "@/components/domain-form";
export default async function EditProductPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="products" mode="edit" subdomain={subdomain} />;
}
