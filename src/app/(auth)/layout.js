export const metadata = {
  title: "Access | OmniERP",
  description: "Sign in to OmniERP",
};
export default function AuthLayout({ children }) {
  return <main className="min-h-screen bg-paper">{children}</main>;
}
