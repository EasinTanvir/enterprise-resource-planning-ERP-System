import ErpPage from "@/components/erp-page";

const Subdomain = async ({ params }) => {
  const { subdomain } = await params;
  return <ErpPage subdomain={subdomain} section="dashboard" />;
};

export default Subdomain;
