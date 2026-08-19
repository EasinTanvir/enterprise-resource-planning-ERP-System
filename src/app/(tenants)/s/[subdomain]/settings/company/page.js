import DomainForm from "@/components/domain-form";
export default async function CompanySettingsPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="company" subdomain={subdomain} />;
}
