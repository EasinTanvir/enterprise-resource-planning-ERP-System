import DomainForm from "@/components/domain-form";
export default async function NewProductPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="products" subdomain={subdomain} />;
}
