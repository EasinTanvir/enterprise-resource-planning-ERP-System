import DomainForm from "@/components/domain-form";
export default async function ProfileSettingsPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="profile" subdomain={subdomain} />;
}
