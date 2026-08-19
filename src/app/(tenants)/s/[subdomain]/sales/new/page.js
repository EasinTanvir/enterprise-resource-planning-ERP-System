import ErpPage from "@/components/erp-page";
export default async function NewSalePage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="sales" form formType="sale" />;
}
