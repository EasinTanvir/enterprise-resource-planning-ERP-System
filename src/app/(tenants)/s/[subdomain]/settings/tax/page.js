import DomainForm from "@/components/domain-form";
export default async function TaxSettingsPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="tax" subdomain={subdomain} />;
}
