import ErpPage from "@/components/erp-page";
export default async function NotificationsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="notifications" />;
}
