import DomainForm from "@/components/domain-form";
export default async function ApproveReturnPage({ params }) {
  const { subdomain } = await params;
  return <DomainForm type="approve" subdomain={subdomain} />;
}
