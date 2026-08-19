import DomainForm from "@/components/domain-form";
export default async function EditCategoryPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="categories" mode="edit" subdomain={subdomain} />;
}
