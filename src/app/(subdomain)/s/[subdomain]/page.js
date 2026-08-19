import ErpApp from "@/components/erp-app";
import React from "react";

const Subdomain = async ({ params }) => {
  const { subdomain } = await params;
  return <ErpApp />;
};

export default Subdomain;
