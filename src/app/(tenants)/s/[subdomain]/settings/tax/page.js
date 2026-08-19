import ErpPage from "@/components/erp-page";
export default async function TaxSettingsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="settings" />;
}
