export const metadata = {
  title: "Access | OmniERP System",
  description: "Sign in to OmniERP System",
};
export default function AuthLayout({ children }) {
  return <main className="min-h-screen bg-paper">{children}</main>;
}
