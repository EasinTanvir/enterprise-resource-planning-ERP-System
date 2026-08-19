import ErpPage from "@/components/erp-page";
export default async function CategoriesPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="categories" />;
}
