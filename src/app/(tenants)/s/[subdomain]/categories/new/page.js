import DomainForm from "@/components/domain-form";
export default async function NewCategoryPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="categories" subdomain={subdomain} />;
}
