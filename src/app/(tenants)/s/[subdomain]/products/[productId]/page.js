import ErpPage from "@/components/erp-page";
export default async function ProductDetailPage({ params }) {
  const { subdomain, productId } = await params;
  return (
    <ErpPage subdomain={subdomain} section="products" detailId={productId} />
  );
}
