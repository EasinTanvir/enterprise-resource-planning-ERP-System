"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  LayoutGrid,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Truck,
  UserRound,
  Users,
  X,
} from "lucide-react";

const tenantNav = [
  ["Overview", "/", Home],
  ["Customers", "/customers", Users],
  ["Products", "/products", Package],
  ["Categories", "/categories", LayoutGrid],
  ["Inventory", "/inventory", Boxes],
  ["Suppliers", "/suppliers", Truck],
  ["Purchasing", "/purchases", ShoppingCart],
  ["Sales", "/sales", ShoppingBag],
  ["Returns", "/returns", FileText],
  ["Invoices", "/invoices", FileText],
  ["Payments", "/payments", CreditCard],
  ["Reports", "/reports", BarChart3],
  ["Employees", "/employees", UserRound],
  ["Roles & permissions", "/roles", ShieldCheck],
  ["Notifications", "/notifications", Bell],
  ["Audit logs", "/audit-logs", ClipboardList],
  ["Settings", "/settings/company", Settings],
];
const adminNav = [
  ["Organizations", "/admin/tenants", Building2],
  ["New organization", "/admin/tenants/new", UserRound],
];

function NavItem({ item, basePath = "" }) {
  const pathname = usePathname();
  const [label, href, Icon] = item;
  const fullHref = `${basePath}${href}`;
  const active =
    href === "/"
      ? pathname === basePath || pathname.endsWith("/s/" + basePath)
      : pathname === fullHref || pathname.startsWith(`${fullHref}/`);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${active ? "bg-white/12 font-semibold text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

function Shell({
  children,
  title,
  subtitle,
  navItems,
  basePath = "",
  footerLabel,
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-nav px-4 py-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-3 pb-7">
          <div>
            <p className="text-lg font-bold tracking-tight">
              OMNI<span className="text-accent">ERP</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/40">
              Retail operations
            </p>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item[1]} item={item} basePath={basePath} />
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="px-3 text-xs text-white/45">{footerLabel}</p>
          <p className="px-3 pt-1 text-sm font-semibold">Ayesha Karim</p>
        </div>
      </aside>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-muted hover:bg-panel lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[.16em] text-muted">
                {subtitle}
              </p>
              <h1 className="mt-1 text-lg font-bold tracking-tight">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-muted hover:bg-panel"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <div className="hidden border-l border-line pl-3 text-right sm:block">
              <p className="text-xs font-semibold">Ayesha Karim</p>
              <p className="text-[11px] text-muted">Administrator</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-accent text-sm font-bold text-white">
              AK
            </div>
          </div>
        </header>
        <main className="app-grid min-h-[calc(100vh-5rem)] p-4 sm:p-8">
          <div className="mx-auto max-w-370">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function TenantShell({ children, subdomain, tenantName }) {
  return (
    <Shell
      title={tenantName}
      subtitle={`${subdomain}.localhost:3000`}
      navItems={tenantNav}
      basePath={`/s/${subdomain}`}
      footerLabel="Tenant workspace"
    >
      {children}
    </Shell>
  );
}
export function AdminShell({ children }) {
  return (
    <Shell
      title="Platform administration"
      subtitle="localhost:3000"
      navItems={adminNav}
      footerLabel="Super admin"
    >
      {children}
    </Shell>
  );
}
