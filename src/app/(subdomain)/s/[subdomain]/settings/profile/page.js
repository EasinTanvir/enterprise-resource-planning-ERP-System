import ErpPage from "@/components/erp-page";
export default async function ProfileSettingsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="settings" />;
}
