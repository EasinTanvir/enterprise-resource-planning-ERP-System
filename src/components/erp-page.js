"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getTenantData } from "@/lib/erp-data";

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});
const formatMoney = (value) => money.format(value).replace("BDT", "৳");
const labels = {
  dashboard: "Overview",
  customers: "Customers",
  products: "Products",
  categories: "Categories",
  inventory: "Inventory",
  suppliers: "Suppliers",
  purchases: "Purchasing",
  sales: "Sales",
  returns: "Returns",
  invoices: "Invoices",
  payments: "Payments",
  reports: "Reports",
  employees: "Employees",
  roles: "Roles & permissions",
  notifications: "Notifications",
  "audit-logs": "Audit logs",
  settings: "Settings",
};

function Badge({ children }) {
  const tone = String(children).toLowerCase();
  const color =
    tone.includes("paid") || tone.includes("active") || tone.includes("stock")
      ? "bg-emerald-50 text-success"
      : tone.includes("unpaid") ||
          tone.includes("out") ||
          tone.includes("inactive")
        ? "bg-red-50 text-danger"
        : "bg-amber-50 text-warning";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${color}`}
    >
      {children}
    </span>
  );
}
function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-panel">
      <table className="w-full min-w-170 text-left text-sm">
        <thead className="border-b border-line bg-paper/70 text-[11px] uppercase tracking-wider text-muted">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-paper/50">
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Stat({ label, value, note, up = true }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <p
        className={`mt-2 flex items-center gap-1 text-xs ${up ? "text-success" : "text-warning"}`}
      >
        {up ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
        {note}
      </p>
    </div>
  );
}
function Header({ title, description, action, href }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-accent">
          Workspace
        </p>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      {action && (
        <Link
          href={href || "#"}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
        >
          <Plus size={16} />
          {action}
        </Link>
      )}
    </div>
  );
}
function SearchBar({ value, onChange }) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-md border border-line bg-panel px-3 py-2.5">
      <Search size={16} className="text-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search records..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </div>
  );
}

export default function ErpPage({
  subdomain,
  section,
  detailId,
  form = false,
}) {
  const data = getTenantData(subdomain);
  const [query, setQuery] = useState("");
  const title = labels[section] || "Workspace";
  if (section === "dashboard")
    return <Dashboard data={data} subdomain={subdomain} />;
  if (form) return <FormView section={section} subdomain={subdomain} />;
  if (detailId)
    return <DetailView section={section} detailId={detailId} data={data} />;
  const source =
    section === "customers"
      ? data.customers
      : section === "products"
        ? data.products
        : section === "inventory"
          ? data.movements
          : section === "sales"
            ? data.sales
            : section === "invoices"
              ? data.invoices
              : section === "employees"
                ? data.staff
                : data.products;
  const filtered = source.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
  );
  const isSimple = [
    "categories",
    "reports",
    "notifications",
    "audit-logs",
    "roles",
    "settings",
    "payments",
    "suppliers",
    "returns",
    "purchases",
  ].includes(section);
  return (
    <div className="reveal">
      <Header
        title={title}
        description={`${title} for ${data.tenant.name}. Review activity, update records, and keep your store moving.`}
        action={
          section === "customers" ||
          section === "products" ||
          section === "suppliers"
            ? `Add ${title.slice(0, -1)}`
            : section === "sales" ||
                section === "purchases" ||
                section === "returns"
              ? `New ${title.slice(0, -1)}`
              : null
        }
        href={`/${section}/new`}
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={query} onChange={setQuery} />
        <button className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-muted">
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>
      {isSimple ? (
        <SimpleSection section={section} data={data} />
      ) : (
        <Table
          headers={
            section === "customers"
              ? ["Customer", "Phone", "Email", "Spent", "Status"]
              : section === "products"
                ? ["Product", "SKU", "Category", "Stock", "Price"]
                : section === "inventory"
                  ? ["Product", "Movement", "Quantity", "Reference", "Date"]
                  : section === "employees"
                    ? ["Employee", "Role", "Status", "Action"]
                    : ["Reference", "Customer", "Total", "Status", "Date"]
          }
          rows={filtered.map((item) => ({
            id: item.id,
            cells:
              section === "customers"
                ? [
                    <Link
                      className="font-semibold hover:text-accent"
                      href={`/customers/${item.id}`}
                      key="name"
                    >
                      {item.name}
                    </Link>,
                    item.phone,
                    item.email,
                    formatMoney(item.spent),
                    <Badge key="status">{item.status}</Badge>,
                  ]
                : section === "products"
                  ? [
                      <Link
                        className="font-semibold hover:text-accent"
                        href={`/products/${item.id}`}
                        key="name"
                      >
                        {item.name}
                      </Link>,
                      item.sku,
                      item.category,
                      <Badge key="stock">{item.status}</Badge>,
                      formatMoney(item.price),
                    ]
                  : section === "inventory"
                    ? [
                        item.product,
                        item.type,
                        <span
                          className={
                            item.quantity > 0
                              ? "font-semibold text-success"
                              : "font-semibold text-danger"
                          }
                          key="qty"
                        >
                          {item.quantity > 0 ? "+" : ""}
                          {item.quantity}
                        </span>,
                        item.reference,
                        item.date,
                      ]
                    : section === "employees"
                      ? [
                          <span className="font-semibold" key="name">
                            {item.name}
                          </span>,
                          item.role,
                          <Badge key="status">{item.status}</Badge>,
                          <button className="text-accent" key="action">
                            Manage
                          </button>,
                        ]
                      : [
                          item.id,
                          item.customer,
                          formatMoney(item.total),
                          <Badge key="status">{item.status}</Badge>,
                          item.date,
                        ],
          }))}
        />
      )}
    </div>
  );
}

function Dashboard({ data, subdomain }) {
  return (
    <div className="reveal">
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-accent">
            {subdomain}.localhost:3000
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Good morning, Ayesha
          </h2>
          <p className="mt-2 text-sm text-muted">
            Here is what is happening at {data.tenant.name} today.
          </p>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">
          Live workspace
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Today's sales"
          value={formatMoney(Math.round(data.tenant.revenue / 18))}
          note="12.8% from yesterday"
        />
        <Stat
          label="Monthly revenue"
          value={formatMoney(data.tenant.revenue)}
          note="8.4% this month"
        />
        <Stat
          label="Customers"
          value={data.tenant.customers}
          note="16 new this month"
        />
        <Stat
          label="Low-stock products"
          value={data.tenant.lowStock}
          note="Needs attention"
          up={false}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-line bg-panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Sales activity</h3>
              <p className="mt-1 text-xs text-muted">
                Last seven business days
              </p>
            </div>
            <Link href="/reports" className="text-xs font-semibold text-accent">
              View report <ChevronRight className="inline" size={14} />
            </Link>
          </div>
          <div className="flex h-48 items-end gap-3 border-b border-line px-2 pb-0">
            {[42, 58, 46, 72, 64, 88, 76].map((height, index) => (
              <div
                className="flex flex-1 flex-col items-center gap-2"
                key={index}
              >
                <div
                  className="w-full rounded-t-sm bg-accent/80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-muted">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-line bg-panel p-5">
          <h3 className="font-bold">Low stock watchlist</h3>
          <p className="mt-1 text-xs text-muted">
            Products approaching reorder level
          </p>
          <div className="mt-5 space-y-4">
            {data.products
              .filter((item) => item.stock < 10)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.stock} units remaining
                    </p>
                  </div>
                  <Badge>{item.status}</Badge>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SimpleSection({ section, data }) {
  const copy =
    {
      categories: ["Smartphones", "Laptops", "Accessories", "Audio"],
      reports: [
        "Sales performance",
        "Inventory valuation",
        "Purchase summary",
        "Customer growth",
      ],
      notifications: [
        "7 products are below reorder level",
        "Invoice INV-10047 is unpaid",
        "Purchase PUR-208 was received today",
      ],
      "audit-logs": [
        "Sale SAL-1048 created by Sabbir Hossain",
        "Stock adjustment approved by Ayesha Karim",
        "Product p-4 price updated",
      ],
      roles: [
        "Tenant Admin",
        "Manager",
        "Sales Employee",
        "Inventory Employee",
      ],
      settings: [
        "Company profile",
        "Invoice settings",
        "Tax settings",
        "Profile and security",
      ],
      payments: ["Cash", "Card", "Bank transfer", "Mobile banking"],
      suppliers: ["Smart Distribution BD", "Gadget Source Ltd", "Tech Imports"],
      returns: ["Waiting for approval", "Approved returns", "Refund history"],
      purchases: ["Draft purchases", "Received purchases", "Supplier balances"],
    }[section] || [];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {copy.map((item, index) => (
        <div key={item} className="rounded-lg border border-line bg-panel p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold">{item}</p>
              <p className="mt-2 text-xs text-muted">
                {section === "settings"
                  ? "Manage tenant-specific configuration and preferences."
                  : `${data.tenant.name} workspace record`}
              </p>
            </div>
            <span className="grid size-9 place-items-center rounded-md bg-accent-soft text-accent">
              <Check size={17} />
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="text-xs text-muted">{index + 3} records</span>
            <button className="text-xs font-semibold text-accent">
              Open <ChevronRight className="inline" size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailView({ section, detailId, data }) {
  const item =
    (section === "customers" ? data.customers : data.products).find(
      (record) => record.id === detailId,
    ) || (section === "sales" ? data.sales[0] : data.products[0]);
  return (
    <div className="reveal">
      <Header
        title={item.name || item.id}
        description={`Detailed ${section.slice(0, -1)} record for ${data.tenant.name}.`}
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-line bg-panel p-6">
          <p className="text-xs uppercase tracking-wider text-muted">
            Record overview
          </p>
          <h3 className="mt-3 text-2xl font-bold">
            {item.name || item.customer}
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Object.entries(item)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs capitalize text-muted">{key}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {typeof value === "number" && key !== "stock"
                      ? formatMoney(value)
                      : String(value)}
                  </p>
                </div>
              ))}
          </div>
        </section>
        <section className="rounded-lg border border-line bg-panel p-6">
          <h3 className="font-bold">Recent activity</h3>
          <div className="mt-5 space-y-4">
            {[
              "Record created",
              "Price or status reviewed",
              "Last viewed by Ayesha Karim",
            ].map((activity) => (
              <div className="border-l-2 border-accent pl-3" key={activity}>
                <p className="text-sm font-semibold">{activity}</p>
                <p className="mt-1 text-xs text-muted">
                  Today in {data.tenant.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FormView({ section, subdomain }) {
  const data = getTenantData(subdomain);
  const title = `New ${section === "purchases" ? "purchase" : section === "returns" ? "return" : section === "sales" ? "sale" : section.slice(0, -1)}`;
  return (
    <div className="reveal">
      <Header
        title={title}
        description={`Create a ${title} for ${data.tenant.name}. This frontend uses local dummy state until the API is connected.`}
      />
      <form
        className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
        onSubmit={(event) => event.preventDefault()}
      >
        <section className="rounded-lg border border-line bg-panel p-6">
          <h3 className="font-bold">Transaction details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Customer or supplier
              <input
                className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
                placeholder="Search records"
              />
            </label>
            <label className="text-sm font-semibold">
              Reference
              <input
                className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
                placeholder="Auto-generated"
              />
            </label>
          </div>
          <div className="mt-6 rounded-md border border-dashed border-line p-5 text-center text-sm text-muted">
            <Plus className="mx-auto mb-2 text-accent" size={20} />
            Add products or line items to this {section.slice(0, -1)}
          </div>
          <button className="mt-6 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            Save draft
          </button>
        </section>
        <aside className="h-fit rounded-lg border border-line bg-panel p-6">
          <h3 className="font-bold">Summary</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <b>{formatMoney(0)}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Discount</span>
              <b>{formatMoney(0)}</b>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <span>Total</span>
              <b>{formatMoney(0)}</b>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
