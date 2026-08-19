import DomainForm from "@/components/domain-form";
export default async function InventoryAdjustPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="adjust" subdomain={subdomain} />;
}
