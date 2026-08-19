import ErpPage from "@/components/erp-page";
export default async function NewReturnPage({ params }) {
  const { subdomain } = await params;
  return (
    <ErpPage subdomain={subdomain} section="returns" form formType="return" />
  );
}
