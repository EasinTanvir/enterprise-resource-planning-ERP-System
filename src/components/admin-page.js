"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Check, ChevronRight, Plus, Search } from "lucide-react";
import { platformTenants } from "@/lib/erp-data";

function Badge({ children }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${children === "Active" ? "bg-emerald-50 text-success" : "bg-amber-50 text-warning"}`}
    >
      {children}
    </span>
  );
}
function Header({ title, description, action, href }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-accent">
          Platform control
        </p>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      {action && (
        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          {action}
        </Link>
      )}
    </div>
  );
}

export default function AdminPage({ mode = "list", tenantId }) {
  const [query, setQuery] = useState("");
  if (mode === "form") return <AdminForm />;
  const tenant =
    platformTenants.find((item) => item.id === tenantId) || platformTenants[0];
  if (mode === "detail") return <AdminDetail tenant={tenant} />;
  const filtered = platformTenants.filter((item) =>
    `${item.name} ${item.slug} ${item.owner}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="reveal">
      <Header
        title="Organizations"
        description="Create and manage the physical retail organizations using OmniERP."
        action="Add organization"
        href="/admin/tenants/new"
      />
      <div className="mb-5 flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5">
        <Search size={16} className="text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search organizations..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-line bg-panel">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="border-b border-line bg-paper/70 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              {["Organization", "Owner", "License", "Users", "Status", ""].map(
                (item) => (
                  <th className="px-5 py-3 font-semibold" key={item}>
                    {item}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((item) => (
              <tr className="hover:bg-paper/50" key={item.id}>
                <td className="px-5 py-4">
                  <Link
                    className="font-semibold hover:text-accent"
                    href={`/admin/tenants/${item.id}`}
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {item.slug}.localhost:3000
                  </p>
                </td>
                <td className="px-5 py-4">{item.owner}</td>
                <td className="px-5 py-4">
                  <Badge>{item.license}</Badge>
                </td>
                <td className="px-5 py-4">{item.users}</td>
                <td className="px-5 py-4">
                  <Badge>{item.status}</Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/tenants/${item.id}`}
                    className="text-accent"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminForm() {
  return (
    <div className="reveal">
      <Header
        title="New organization"
        description="Set up a retail organization and its lifetime license."
      />
      <form
        className="max-w-3xl rounded-lg border border-line bg-panel p-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Organization name
            <input
              required
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
              placeholder="Example Retail BD"
            />
          </label>
          <label className="text-sm font-semibold">
            Subdomain slug
            <input
              required
              pattern="[a-z0-9-]+"
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
              placeholder="example"
            />
            <span className="mt-1 block text-xs font-normal text-muted">
              example.localhost:3000
            </span>
          </label>
          <label className="text-sm font-semibold">
            Owner name
            <input
              required
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
              placeholder="Owner name"
            />
          </label>
          <label className="text-sm font-semibold">
            Owner email
            <input
              required
              type="email"
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
              placeholder="owner@example.com"
            />
          </label>
        </div>
        <div className="mt-6 rounded-md bg-accent-soft p-4">
          <p className="text-sm font-bold text-accent">Lifetime license</p>
          <p className="mt-1 text-xs text-muted">
            This organization receives one-time lifetime access. No recurring
            billing is configured.
          </p>
        </div>
        <button className="mt-6 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
          Create organization
        </button>
      </form>
    </div>
  );
}
function AdminDetail({ tenant }) {
  return (
    <div className="reveal">
      <Header
        title={tenant.name}
        description={`Platform record for ${tenant.slug}.localhost:3000.`}
        action="Edit organization"
        href={`/admin/tenants/${tenant.id}/edit`}
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-line bg-panel p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-12 place-items-center rounded-md bg-accent-soft text-accent">
              <Building2 size={23} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{tenant.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {tenant.slug}.localhost:3000
              </p>
            </div>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {[
              ["Owner", tenant.owner],
              ["Joined", tenant.joined],
              ["Users", tenant.users],
              ["License", tenant.license],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-line bg-panel p-6">
          <h3 className="font-bold">Organization status</h3>
          <div className="mt-5 flex items-center gap-3">
            <Badge>{tenant.status}</Badge>
            <span className="text-sm text-muted">Operational</span>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex gap-2">
              <Check className="text-success" size={16} />
              Lifetime license active
            </p>
            <p className="flex gap-2">
              <Check className="text-success" size={16} />
              Subdomain configured
            </p>
            <p className="flex gap-2">
              <Check className="text-success" size={16} />
              Admin account assigned
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
