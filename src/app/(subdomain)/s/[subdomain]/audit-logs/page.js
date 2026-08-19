import ErpPage from "@/components/erp-page";
export default async function AuditLogsPage({ params }) {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="audit-logs" />;
}
