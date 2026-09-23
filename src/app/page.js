import Link from "next/link";
import { ArrowUpRight, Building2, Globe2, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-nav text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <p className="text-xl font-bold tracking-tight">
            OMNI<span className="text-accent">ERP</span>
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-white/70 hover:text-white"
          >
            Sign in <ArrowUpRight className="inline" size={15} />
          </Link>
        </header>
        <div className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr]">
          <section>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-accent">
              Physical retail operations
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.04] tracking-tight sm:text-7xl">
              One clear view of every store.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
              OmniERP gives retail teams a focused workspace for stock, sales,
              purchases, customers, and invoices.
            </p>
            <Link
              href="/admin/tenants"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white"
            >
              Open platform control <ArrowUpRight size={17} />
            </Link>
          </section>
          <section className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <Building2 className="text-accent" size={22} />
              <p className="mt-5 font-bold">Two organizations</p>
              <p className="mt-2 text-sm text-white/50">
                abc and xyz are ready for tenant-scoped UI testing.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <Globe2 className="text-accent" size={22} />
              <p className="mt-5 font-bold">Subdomain workspaces</p>
              <p className="mt-2 text-sm text-white/50">
                Open abc.localhost:3000 or xyz.localhost:3000.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="text-accent" size={22} />
              <p className="mt-5 font-bold">Platform control</p>
              <p className="mt-2 text-sm text-white/50">
                Manage organization status and lifetime licenses.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
