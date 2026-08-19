import DomainForm from "@/components/domain-form";
export default async function MovementDetailPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="adjust" subdomain={subdomain} mode="edit" />;
}
