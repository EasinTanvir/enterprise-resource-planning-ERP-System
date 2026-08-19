"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});
const fmt = (value) => money.format(value).replace("BDT", "৳");
const nav = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products", href: "/products", icon: Package },
  { label: "Categories", href: "/categories", icon: LayoutGrid },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Purchasing", href: "/purchases", icon: ShoppingCart },
  { label: "Sales", href: "/sales", icon: ShoppingBag },
  { label: "Returns", href: "/returns", icon: ArrowDownLeft },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];
const adminNav = [
  { label: "Employees", href: "/employees", icon: UserRound },
  { label: "Roles & permissions", href: "/roles", icon: ShieldCheck },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Audit logs", href: "/audit-logs", icon: ClipboardList },
  { label: "Settings", href: "/settings/company", icon: Settings },
];
const products = [
  {
    id: "p-1",
    name: "iPhone 15 128GB",
    sku: "IP15-128-BLK",
    category: "Smartphones",
    stock: 18,
    price: 89900,
    status: "In stock",
  },
  {
    id: "p-2",
    name: "Galaxy S24 Ultra",
    sku: "GS24U-256-TIT",
    category: "Smartphones",
    stock: 7,
    price: 124900,
    status: "Low stock",
  },
  {
    id: "p-3",
    name: "AirPods Pro (2nd gen)",
    sku: "APP2-USBC-WHT",
    category: "Accessories",
    stock: 42,
    price: 26900,
    status: "In stock",
  },
  {
    id: "p-4",
    name: "MacBook Air M3 13-inch",
    sku: "MBA-M3-256-SLV",
    category: "Laptops",
    stock: 4,
    price: 139900,
    status: "Low stock",
  },
  {
    id: "p-5",
    name: "Anker 65W GaN Charger",
    sku: "ANK-65W-GAN-BLK",
    category: "Accessories",
    stock: 0,
    price: 6900,
    status: "Out of stock",
  },
  {
    id: "p-6",
    name: "JBL Charge 5",
    sku: "JBL-C5-BLU",
    category: "Audio",
    stock: 23,
    price: 18900,
    status: "In stock",
  },
];
const customers = [
  {
    id: "CUS-00481",
    name: "Nusrat Jahan",
    phone: "+880 1712 884 210",
    email: "nusrat.j@example.com",
    purchases: 8,
    spent: 384500,
    status: "Active",
  },
  {
    id: "CUS-00480",
    name: "Sakib Rahman",
    phone: "+880 1819 440 331",
    email: "sakib.r@example.com",
    purchases: 3,
    spent: 162800,
    status: "Active",
  },
  {
    id: "CUS-00479",
    name: "Farhan Ahmed",
    phone: "+880 1611 289 104",
    email: "farhan.a@example.com",
    purchases: 12,
    spent: 691200,
    status: "Active",
  },
  {
    id: "CUS-00478",
    name: "Maliha Chowdhury",
    phone: "+880 1914 555 208",
    email: "maliha.c@example.com",
    purchases: 1,
    spent: 26900,
    status: "Inactive",
  },
  {
    id: "CUS-00477",
    name: "Tahmid Hasan",
    phone: "+880 1552 314 901",
    email: "tahmid.h@example.com",
    purchases: 5,
    spent: 212400,
    status: "Active",
  },
];
const sales = [
  {
    id: "SL-240819-184",
    customer: "Nusrat Jahan",
    by: "Ayesha Karim",
    total: 124900,
    status: "Paid",
    time: "Today, 11:42 AM",
  },
  {
    id: "SL-240819-183",
    customer: "Walk-in customer",
    by: "Rafi Islam",
    total: 26900,
    status: "Paid",
    time: "Today, 11:18 AM",
  },
  {
    id: "SL-240819-182",
    customer: "Sakib Rahman",
    by: "Ayesha Karim",
    total: 95900,
    status: "Partial",
    time: "Today, 10:46 AM",
  },
  {
    id: "SL-240818-181",
    customer: "Farhan Ahmed",
    by: "Rafi Islam",
    total: 18900,
    status: "Paid",
    time: "Yesterday, 4:32 PM",
  },
  {
    id: "SL-240818-180",
    customer: "Maliha Chowdhury",
    by: "Ayesha Karim",
    total: 6900,
    status: "Refunded",
    time: "Yesterday, 3:16 PM",
  },
];
const movements = [
  {
    id: "MOV-9084",
    product: "iPhone 15 128GB",
    type: "Sale",
    quantity: -1,
    reference: "SL-240819-184",
    date: "Aug 19, 2026",
  },
  {
    id: "MOV-9083",
    product: "Galaxy S24 Ultra",
    type: "Purchase",
    quantity: 10,
    reference: "PO-260819-034",
    date: "Aug 19, 2026",
  },
  {
    id: "MOV-9082",
    product: "Anker 65W GaN Charger",
    type: "Damage",
    quantity: -2,
    reference: "ADJ-00128",
    date: "Aug 18, 2026",
  },
  {
    id: "MOV-9081",
    product: "AirPods Pro (2nd gen)",
    type: "Return",
    quantity: 1,
    reference: "RET-260818-021",
    date: "Aug 18, 2026",
  },
];

function Button({
  children,
  variant = "primary",
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  const styles = {
    primary: "bg-accent text-white hover:bg-[#bd4e38]",
    secondary: "border border-line bg-panel text-ink hover:bg-paper",
    ghost: "text-muted hover:bg-paper hover:text-ink",
    danger: "bg-danger text-white hover:bg-[#983a3a]",
  };
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}
function Badge({ children }) {
  const tone =
    {
      "In stock": "bg-[#e8f4ee] text-success",
      "Low stock": "bg-[#fff3dc] text-warning",
      "Out of stock": "bg-[#fce9e7] text-danger",
      Paid: "bg-[#e8f4ee] text-success",
      Partial: "bg-[#fff3dc] text-warning",
      Refunded: "bg-[#f1eef7] text-[#665786]",
      Active: "bg-[#e8f4ee] text-success",
      Inactive: "bg-[#eef0ee] text-muted",
      Sale: "bg-[#fce9e7] text-danger",
      Purchase: "bg-[#e8f4ee] text-success",
      Return: "bg-[#e5f0f6] text-[#3c7085]",
      Damage: "bg-[#fff3dc] text-warning",
    }[children] || "bg-paper text-muted";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {children}
    </span>
  );
}
function Avatar({ name, size = "md" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#f5d7cf] font-bold text-[#914434] ${size === "sm" ? "size-7 text-[10px]" : "size-9 text-xs"}`}
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)}
    </span>
  );
}
function Section({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-lg border border-line bg-panel ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-sm font-bold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-accent">
          {eyebrow}
          <span className="h-px w-5 bg-accent" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
function Stat({ label, value, detail, icon: Icon, trend, negative = false }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <span className="rounded-md bg-accent-soft p-2 text-accent">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className={
            negative
              ? "font-semibold text-danger"
              : "font-semibold text-success"
          }
        >
          {trend}
        </span>
        <span className="text-muted">{detail}</span>
      </div>
    </div>
  );
}
function FilterBar({ placeholder = "Search records", options = [] }) {
  const form = useForm({ defaultValues: { search: "", status: "All status" } });
  return (
    <form
      onSubmit={form.handleSubmit(() => {})}
      className="flex flex-col gap-2 border-b border-line bg-[#fcfcfa] p-4 sm:flex-row"
    >
      <label className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          size={16}
        />
        <input
          {...form.register("search")}
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-line bg-panel pl-9 pr-3 text-sm outline-none transition focus:border-accent"
        />
      </label>
      {options.length > 0 && (
        <select
          {...form.register("status")}
          className="h-10 rounded-md border border-line bg-panel px-3 text-sm text-muted outline-none focus:border-accent"
        >
          <option>All status</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      )}
      <Button variant="secondary" icon={SlidersHorizontal}>
        Filters
      </Button>
    </form>
  );
}
function Table({ columns, rows, renderRow }) {
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-[#fcfcfa] text-[11px] uppercase tracking-wider text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}
function ErrorText({ message }) {
  return message ? (
    <p className="mt-1 text-xs font-medium text-danger" role="alert">
      {message}
    </p>
  ) : null;
}
function Field({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  required = false,
  ...props
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      {required && <span className="ml-1 text-accent">*</span>}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className={`mt-1.5 h-10 w-full rounded-md border bg-panel px-3 text-sm outline-none transition placeholder:text-[#a0a7a2] focus:border-accent ${error ? "border-danger" : "border-line"}`}
        {...props}
      />
      <ErrorText message={error?.message} />
    </label>
  );
}
function FormCard({ title, children, onSubmit, submitLabel = "Save changes" }) {
  const form = useForm();
  return (
    <Section title={title}>
      <form
        className="space-y-5 p-5"
        onSubmit={form.handleSubmit(onSubmit || (() => {}))}
      >
        {children}
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="secondary">Cancel</Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Section>
  );
}
function Chart() {
  const points =
    "0,112 42,104 84,108 126,82 168,89 210,60 252,72 294,45 336,52 378,24";
  return (
    <div className="relative h-56 overflow-hidden px-1 pt-4">
      <div className="absolute inset-0 flex flex-col justify-between py-4 text-[10px] text-muted">
        <span>৳ 1.2m</span>
        <span>৳ 800k</span>
        <span>৳ 400k</span>
        <span>৳ 0</span>
      </div>
      <svg
        viewBox="0 0 380 130"
        preserveAspectRatio="none"
        className="absolute inset-x-10 top-5 h-44 w-[calc(100%-3rem)]"
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d95d43" stopOpacity=".22" />
            <stop offset="1" stopColor="#d95d43" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,130 ${points} 380,130`} fill="url(#chart-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#d95d43"
          strokeWidth="2.5"
        />
      </svg>
      <div className="absolute inset-x-10 bottom-0 flex justify-between text-[10px] text-muted">
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
      </div>
    </div>
  );
}

function Shell({ children, pathname, onNavigate }) {
  const [open, setOpen] = useState(false);
  const active =
    pathname === "/dashboard" ? "/dashboard" : `/${pathname.split("/")[1]}`;
  const go = (href) => {
    onNavigate(href);
    setOpen(false);
  };
  return (
    <div className="min-h-screen bg-paper">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-nav text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            onClick={() => go("/dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-accent font-black">
              O
            </span>
            <span>
              <strong className="block text-sm tracking-wide">OMNIERP</strong>
              <small className="text-[10px] text-white/50">
                Retail operations
              </small>
            </span>
          </button>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={18} />
          </button>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.18em] text-white/35">
            Workspace
          </p>
          {nav.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => go(href)}
              className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${active === href.split("/")[1] || (href === "/dashboard" && pathname === "/dashboard") ? "bg-white/12 font-semibold text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
          <p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[.18em] text-white/35">
            Administration
          </p>
          {adminNav.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => go(href)}
              className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${active === href.split("/")[1] ? "bg-white/12 font-semibold text-white" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar name="Ayesha Karim" size="sm" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Ayesha Karim</p>
              <p className="truncate text-[10px] text-white/45">
                Tenant administrator
              </p>
            </div>
            <button className="ml-auto text-white/40">
              <MoreHorizontal size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md p-2 text-muted hover:bg-panel lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-muted sm:flex">
              <span>Apple Gadget BD</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-ink">
                {nav.find((item) => active === item.href.split("/")[1])
                  ?.label || "Workspace"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-md p-2 text-muted hover:bg-panel">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />
            </button>
            <div className="mx-1 h-6 w-px bg-line" />
            <Avatar name="Ayesha Karim" />
          </div>
        </header>
        <main className="app-grid min-h-[calc(100vh-5rem)] p-4 sm:p-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Dashboard({ go }) {
  return (
    <div className="reveal">
      <PageHeader
        eyebrow="Monday, 19 August 2026"
        title="Good morning, Ayesha"
        description="Here is what is happening across Apple Gadget BD today."
        action={
          <Button icon={Plus} onClick={() => go("/sales/new")}>
            New sale
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Today's sales"
          value="৳ 286,400"
          detail="vs yesterday"
          trend="+12.8%"
          icon={ArrowUpRight}
        />
        <Stat
          label="Total customers"
          value="4,821"
          detail="active profiles"
          trend="+84"
          icon={Users}
        />
        <Stat
          label="Inventory value"
          value="৳ 18.4m"
          detail="at purchase price"
          trend="+3.2%"
          icon={Boxes}
        />
        <Stat
          label="Unpaid invoices"
          value="৳ 142,800"
          detail="across 17 invoices"
          trend="Needs attention"
          negative
          icon={AlertCircle}
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Section
          title="Sales performance"
          action={
            <button className="text-xs font-semibold text-accent">
              View report
            </button>
          }
        >
          <div className="px-5">
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-2xl font-bold">৳ 6.84m</p>
                <p className="text-xs text-muted">
                  Revenue this year{" "}
                  <span className="ml-1 font-semibold text-success">
                    +18.4%
                  </span>
                </p>
              </div>
              <select className="rounded-md border border-line bg-panel px-2 py-1.5 text-xs text-muted">
                <option>Last 6 months</option>
              </select>
            </div>
            <Chart />
          </div>
        </Section>
        <Section
          title="Stock requiring attention"
          action={
            <button
              onClick={() => go("/inventory")}
              className="text-xs font-semibold text-accent"
            >
              View inventory
            </button>
          }
        >
          <div className="divide-y divide-line">
            {products
              .filter((p) => p.stock < 10)
              .map((product) => (
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  key={product.id}
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-paper">
                    <Package size={18} className="text-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{product.stock} units</p>
                    <Badge>{product.status}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </Section>
      </div>
      <div className="mt-5">
        <Section
          title="Latest sales"
          action={
            <button
              onClick={() => go("/sales")}
              className="text-xs font-semibold text-accent"
            >
              See all sales
            </button>
          }
        >
          <Table
            columns={[
              "Sale ID",
              "Customer",
              "Sold by",
              "Total",
              "Status",
              "Time",
            ]}
            rows={sales.slice(0, 4)}
            renderRow={(sale) => (
              <tr key={sale.id} className="hover:bg-[#fcfcfa]">
                <td className="px-5 py-4 font-semibold text-accent">
                  {sale.id}
                </td>
                <td className="px-5 py-4">{sale.customer}</td>
                <td className="px-5 py-4 text-muted">{sale.by}</td>
                <td className="px-5 py-4 font-semibold">{fmt(sale.total)}</td>
                <td className="px-5 py-4">
                  <Badge>{sale.status}</Badge>
                </td>
                <td className="px-5 py-4 text-muted">{sale.time}</td>
              </tr>
            )}
          />
        </Section>
      </div>
    </div>
  );
}

function ListPage({ type, go }) {
  const config = {
    customers: {
      title: "Customers",
      desc: "Manage the people who purchase from your stores.",
      action: "Add customer",
      href: "/customers/new",
      placeholder: "Search by name, phone or email",
      columns: ["Customer", "Contact", "Purchases", "Lifetime value", "Status"],
      rows: customers,
      render: (row) => (
        <tr key={row.id} className="hover:bg-[#fcfcfa]">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <Avatar name={row.name} />
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-muted">{row.id}</p>
              </div>
            </div>
          </td>
          <td className="px-5 py-4">
            <p>{row.phone}</p>
            <p className="text-xs text-muted">{row.email}</p>
          </td>
          <td className="px-5 py-4">{row.purchases}</td>
          <td className="px-5 py-4 font-semibold">{fmt(row.spent)}</td>
          <td className="px-5 py-4">
            <Badge>{row.status}</Badge>
          </td>
        </tr>
      ),
    },
    products: {
      title: "Products",
      desc: "Your catalog, pricing and stock availability in one place.",
      action: "Add product",
      href: "/products/new",
      placeholder: "Search by product name or SKU",
      columns: ["Product", "Category", "Price", "Stock", "Status"],
      rows: products,
      render: (row) => (
        <tr key={row.id} className="hover:bg-[#fcfcfa]">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-paper">
                <Package size={17} className="text-muted" />
              </div>
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-muted">{row.sku}</p>
              </div>
            </div>
          </td>
          <td className="px-5 py-4 text-muted">{row.category}</td>
          <td className="px-5 py-4 font-semibold">{fmt(row.price)}</td>
          <td className="px-5 py-4">{row.stock}</td>
          <td className="px-5 py-4">
            <Badge>{row.status}</Badge>
          </td>
        </tr>
      ),
    },
    sales: {
      title: "Sales",
      desc: "Track every physical retail transaction from your stores.",
      action: "New sale",
      href: "/sales/new",
      placeholder: "Search sale ID or customer",
      columns: ["Sale ID", "Customer", "Sold by", "Total", "Status", "Created"],
      rows: sales,
      render: (row) => (
        <tr key={row.id} className="hover:bg-[#fcfcfa]">
          <td className="px-5 py-4 font-semibold text-accent">{row.id}</td>
          <td className="px-5 py-4">{row.customer}</td>
          <td className="px-5 py-4 text-muted">{row.by}</td>
          <td className="px-5 py-4 font-semibold">{fmt(row.total)}</td>
          <td className="px-5 py-4">
            <Badge>{row.status}</Badge>
          </td>
          <td className="px-5 py-4 text-muted">{row.time}</td>
        </tr>
      ),
    },
    inventory: {
      title: "Inventory",
      desc: "Know what is on hand, what is moving and what needs attention.",
      action: "Adjust stock",
      href: "/inventory/movements",
      placeholder: "Search products or SKU",
      columns: ["Product", "SKU", "On hand", "Reorder level", "Status"],
      rows: products,
      render: (row) => (
        <tr key={row.id} className="hover:bg-[#fcfcfa]">
          <td className="px-5 py-4 font-semibold">{row.name}</td>
          <td className="px-5 py-4 text-muted">{row.sku}</td>
          <td className="px-5 py-4 font-bold">{row.stock}</td>
          <td className="px-5 py-4">10</td>
          <td className="px-5 py-4">
            <Badge>{row.status}</Badge>
          </td>
        </tr>
      ),
    },
  }[type];
  return (
    <div className="reveal">
      <PageHeader
        eyebrow="Workspace"
        title={config.title}
        description={config.desc}
        action={
          <Button icon={Plus} onClick={() => go(config.href)}>
            {config.action}
          </Button>
        }
      />
      <Section
        title={`${config.rows.length} records`}
        action={
          <Button variant="secondary" icon={SlidersHorizontal}>
            Customize
          </Button>
        }
      >
        <FilterBar
          placeholder={config.placeholder}
          options={["Active", "Inactive", "Low stock"]}
        />
        <Table
          columns={config.columns}
          rows={config.rows}
          renderRow={config.render}
        />
        <div className="flex items-center justify-between border-t border-line px-5 py-4 text-xs text-muted">
          <span>
            Showing 1–{config.rows.length} of {config.rows.length} records
          </span>
          <div className="flex gap-1">
            <button className="rounded border border-line p-1.5">
              <ChevronLeft size={14} />
            </button>
            <button className="rounded bg-accent px-2.5 py-1.5 font-semibold text-white">
              1
            </button>
            <button className="rounded border border-line p-1.5">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Detail({ entity, go }) {
  const row =
    entity === "customer"
      ? customers[0]
      : entity === "product"
        ? products[0]
        : sales[0];
  const title =
    entity === "customer" ? row.name : entity === "product" ? row.name : row.id;
  return (
    <div className="reveal">
      <button
        onClick={() =>
          go(
            entity === "customer"
              ? "/customers"
              : entity === "product"
                ? "/products"
                : "/sales",
          )
        }
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent"
      >
        <ChevronLeft size={16} />
        Back to {entity}s
      </button>
      <PageHeader
        eyebrow={`${entity} details`}
        title={title}
        description={
          entity === "customer"
            ? row.email
            : entity === "product"
              ? `${row.sku} · ${row.category}`
              : `${row.customer} · ${row.time}`
        }
        action={
          <Button variant="secondary" icon={MoreHorizontal}>
            More actions
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Section title="Overview">
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            {(entity === "customer"
              ? [
                  ["Phone", row.phone],
                  ["Email", row.email],
                  ["Customer ID", row.id],
                  ["Lifetime value", fmt(row.spent)],
                ]
              : entity === "product"
                ? [
                    ["SKU", row.sku],
                    ["Category", row.category],
                    ["Selling price", fmt(row.price)],
                    ["Current stock", `${row.stock} units`],
                  ]
                : [
                    ["Customer", row.customer],
                    ["Sold by", row.by],
                    ["Total", fmt(row.total)],
                    ["Payment status", row.status],
                  ]
            ).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {label}
                </p>
                <p className="mt-1.5 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Activity">
          <div className="space-y-5 p-5">
            {[
              "Record created",
              "Information verified",
              "Last activity recorded",
            ].map((item, index) => (
              <div className="flex gap-3" key={item}>
                <span className="mt-1 size-2 rounded-full bg-accent" />
                <div>
                  <p className="text-sm font-semibold">{item}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {index + 1} day{index ? "s" : ""} ago · Ayesha Karim
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function TransactionForm({ kind, go }) {
  const form = useForm({
    defaultValues: { customer: "", reference: "", notes: "" },
  });
  const [items, setItems] = useState([
    { product: products[0].name, quantity: 1, price: products[0].price },
  ]);
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const submit = () =>
    go(
      kind === "sale"
        ? "/sales"
        : kind === "purchase"
          ? "/purchases"
          : "/returns",
    );
  return (
    <div className="reveal">
      <PageHeader
        eyebrow="New transaction"
        title={`Create ${kind}`}
        description="Complete the details below. You can review everything before confirming."
        action={
          <Button variant="secondary" onClick={() => go(`/${kind}s`)}>
            Discard
          </Button>
        }
      />
      <form
        onSubmit={form.handleSubmit(submit)}
        className="grid gap-5 xl:grid-cols-[1.6fr_1fr]"
      >
        <div className="space-y-5">
          <Section title="Transaction details">
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field
                label={kind === "purchase" ? "Supplier" : "Customer"}
                name="customer"
                register={form.register}
                error={form.formState.errors.customer}
                placeholder={`Select ${kind === "purchase" ? "supplier" : "customer"}`}
                required
              />
              <Field
                label="Reference note"
                name="reference"
                register={form.register}
                error={form.formState.errors.reference}
                placeholder="Optional reference"
              />
            </div>
          </Section>
          <Section
            title="Line items"
            action={
              <Button
                variant="secondary"
                icon={Plus}
                onClick={() =>
                  setItems([
                    ...items,
                    {
                      product: products[2].name,
                      quantity: 1,
                      price: products[2].price,
                    },
                  ])
                }
              >
                Add item
              </Button>
            }
          >
            <div className="divide-y divide-line">
              {items.map((item, index) => (
                <div
                  className="grid gap-3 p-5 sm:grid-cols-[1fr_100px_130px_32px]"
                  key={`${item.product}-${index}`}
                >
                  <label className="text-sm font-medium">
                    Product
                    <select
                      value={item.product}
                      onChange={(event) =>
                        setItems(
                          items.map((current, itemIndex) =>
                            itemIndex === index
                              ? { ...current, product: event.target.value }
                              : current,
                          ),
                        )
                      }
                      className="mt-1.5 h-10 w-full rounded-md border border-line bg-panel px-3 text-sm outline-none focus:border-accent"
                    >
                      {products.map((product) => (
                        <option key={product.id}>{product.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium">
                    Qty
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        setItems(
                          items.map((current, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...current,
                                  quantity: Number(event.target.value),
                                }
                              : current,
                          ),
                        )
                      }
                      className="mt-1.5 h-10 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Unit price
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(event) =>
                        setItems(
                          items.map((current, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...current,
                                  price: Number(event.target.value),
                                }
                              : current,
                          ),
                        )
                      }
                      className="mt-1.5 h-10 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setItems(
                        items.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="mt-7 rounded p-2 text-muted hover:bg-[#fce9e7] hover:text-danger"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div className="space-y-5">
          <Section title="Summary">
            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{fmt(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Discount</span>
                <span className="font-semibold">৳ 0</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <span className="font-bold">Total</span>
                <span className="font-bold text-accent">{fmt(total)}</span>
              </div>
              <Button className="mt-3 w-full" type="submit">
                Confirm {kind}
              </Button>
            </div>
          </Section>
          <Section title="Notes">
            <div className="p-5">
              <textarea
                {...form.register("notes")}
                rows="4"
                placeholder="Add an internal note..."
                className="w-full resize-none rounded-md border border-line p-3 text-sm outline-none focus:border-accent"
              />
            </div>
          </Section>
        </div>
      </form>
    </div>
  );
}

function FormPage({ type, go }) {
  const form = useForm();
  const config = {
    login: [
      "Sign in",
      "Use your store account to continue",
      "Email address",
      "Password",
    ],
    forgot: [
      "Reset your password",
      "We will send a recovery link to your email",
      "Email address",
      null,
    ],
    customer: [
      "Add customer",
      "Create a customer profile for your store",
      "Full name",
      "Phone number",
    ],
    product: [
      "Add product",
      "Add a new item to your catalog",
      "Product name",
      "SKU",
    ],
    supplier: [
      "Add supplier",
      "Keep supplier information up to date",
      "Supplier name",
      "Phone number",
    ],
    employee: [
      "Add employee",
      "Invite a member of your store team",
      "Full name",
      "Email address",
    ],
    tenant: [
      "Create tenant",
      "Set up a new retail organization",
      "Organization name",
      "Administrator email",
    ],
  }[type];
  const isLogin = type === "login";
  return (
    <div
      className={
        isLogin
          ? "flex min-h-[calc(100vh-5rem)] items-center justify-center"
          : "reveal max-w-3xl"
      }
    >
      {!isLogin && (
        <button
          onClick={() => go("/dashboard")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent"
        >
          <ChevronLeft size={16} />
          Back to workspace
        </button>
      )}
      <div
        className={`rounded-lg border border-line bg-panel ${isLogin ? "w-full max-w-md p-7 shadow-sm" : "p-5"}`}
      >
        <div className="mb-6">
          <span className="mb-4 inline-flex size-10 items-center justify-center rounded-md bg-accent text-lg font-black text-white">
            O
          </span>
          <h1 className="text-xl font-bold tracking-tight">{config[0]}</h1>
          <p className="mt-1 text-sm text-muted">{config[1]}</p>
        </div>
        <form
          onSubmit={form.handleSubmit(() =>
            go(isLogin ? "/dashboard" : "/dashboard"),
          )}
          className="space-y-4"
        >
          <Field
            label={config[2]}
            name="first"
            register={form.register}
            error={form.formState.errors.first}
            type={type === "forgot" || type === "login" ? "email" : "text"}
            placeholder={`Enter ${config[2].toLowerCase()}`}
            required
          />
          {config[3] && (
            <Field
              label={config[3]}
              name="second"
              register={form.register}
              error={form.formState.errors.second}
              type={isLogin ? "password" : "text"}
              placeholder={`Enter ${config[3].toLowerCase()}`}
              required
            />
          )}
          <Button type="submit" className="w-full">
            {isLogin
              ? "Sign in"
              : type === "forgot"
                ? "Send recovery link"
                : "Create record"}
          </Button>
        </form>
        {isLogin && (
          <button
            onClick={() => go("/forgot-password")}
            className="mt-5 w-full text-center text-xs font-semibold text-accent"
          >
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}
function UtilityPage({ type, go }) {
  const titles = {
    categories: [
      "Categories",
      "Organize products so your team can find them quickly.",
    ],
    suppliers: [
      "Suppliers",
      "Manage your wholesale partners and purchasing history.",
    ],
    purchases: [
      "Purchasing",
      "Track purchase orders and stock received from suppliers.",
    ],
    returns: [
      "Returns",
      "Review product returns and keep stock history accurate.",
    ],
    invoices: [
      "Invoices",
      "Find invoices, payment status and customer documents.",
    ],
    payments: ["Payments", "Review cash, card and mobile banking collections."],
    reports: [
      "Reports",
      "Turn store activity into decisions with clear reporting.",
    ],
    employees: ["Employees", "Manage the team members who run your stores."],
    roles: [
      "Roles & permissions",
      "Keep access aligned with each team member's responsibility.",
    ],
    notifications: [
      "Notifications",
      "Stay on top of low stock and important business events.",
    ],
    "audit-logs": [
      "Audit logs",
      "A clear history of administrative and business activity.",
    ],
    settings: [
      "Company settings",
      "Keep your company profile and invoice identity current.",
    ],
    admin: [
      "Tenant management",
      "Manage organizations and lifetime access across the platform.",
    ],
  };
  const [title, description] = titles[type] || titles.settings;
  const rows =
    type === "purchases"
      ? sales.map((sale, i) => ({
          ...sale,
          id: `PO-2608${i + 20}-0${i + 3}`,
          customer: [
            "Gadget Source Ltd.",
            "Smart Tech Distribution",
            "Bengal Mobile House",
          ][i % 3],
          total: sale.total * 3,
          status: i === 2 ? "Partial" : "Paid",
        }))
      : type === "invoices"
        ? sales.map((sale) => ({ ...sale, id: `INV-${sale.id.slice(3)}` }))
        : type === "payments"
          ? sales
              .slice(0, 4)
              .map((sale) => ({ ...sale, id: `PAY-${sale.id.slice(3)}` }))
          : sales;
  return (
    <div className="reveal">
      <PageHeader
        eyebrow="Workspace"
        title={title}
        description={description}
        action={
          <Button
            icon={Plus}
            onClick={() =>
              go(
                type === "purchases"
                  ? "/purchases/new"
                  : type === "returns"
                    ? "/returns/new"
                    : type === "employees"
                      ? "/employees/new"
                      : "/settings/company",
              )
            }
          >
            {type === "reports" ? "Export report" : "Add new"}
          </Button>
        }
      />
      {type === "reports" ? (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label="Gross sales"
              value="৳ 6.84m"
              detail="year to date"
              trend="+18.4%"
              icon={BarChart3}
            />
            <Stat
              label="Units sold"
              value="1,284"
              detail="year to date"
              trend="+9.6%"
              icon={ShoppingBag}
            />
            <Stat
              label="Average sale"
              value="৳ 42,800"
              detail="per transaction"
              trend="+4.1%"
              icon={Zap}
            />
          </div>
          <Section title="Revenue overview">
            <div className="p-5">
              <Chart />
            </div>
          </Section>
        </div>
      ) : (
        <Section
          title={type === "admin" ? "3 active tenants" : "Recent records"}
          action={
            <Button variant="secondary" icon={SlidersHorizontal}>
              Filters
            </Button>
          }
        >
          <FilterBar
            placeholder={`Search ${title.toLowerCase()}`}
            options={["Active", "Paid", "Pending"]}
          />
          <Table
            columns={[
              "Reference",
              "Name / customer",
              "Owner",
              "Amount",
              "Status",
              "Date",
            ]}
            rows={rows}
            renderRow={(row) => (
              <tr key={row.id} className="hover:bg-[#fcfcfa]">
                <td className="px-5 py-4 font-semibold text-accent">
                  {row.id}
                </td>
                <td className="px-5 py-4">{row.customer}</td>
                <td className="px-5 py-4 text-muted">{row.by}</td>
                <td className="px-5 py-4 font-semibold">{fmt(row.total)}</td>
                <td className="px-5 py-4">
                  <Badge>{row.status}</Badge>
                </td>
                <td className="px-5 py-4 text-muted">{row.time}</td>
              </tr>
            )}
          />
        </Section>
      )}
    </div>
  );
}

export default function ErpApp() {
  const [pathname, setPathname] = useState(
    typeof window === "undefined" ? "/dashboard" : window.location.pathname,
  );
  const go = (href) => {
    window.history.pushState({}, "", href);
    setPathname(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const parts = pathname.split("/").filter(Boolean);
  const root = parts[0] || "dashboard";
  const isAccess = root === "login" || root === "forgot-password";
  let content;
  if (isAccess)
    content = <FormPage type={root === "login" ? "login" : "forgot"} go={go} />;
  else if (root === "dashboard") content = <Dashboard go={go} />;
  else if (
    ["customers", "products", "sales", "inventory"].includes(root) &&
    parts.length === 1
  )
    content = <ListPage type={root} go={go} />;
  else if (
    ["customers", "products", "sales"].includes(root) &&
    parts.length > 1 &&
    !["new"].includes(parts[1])
  )
    content = (
      <Detail
        entity={
          root === "customers"
            ? "customer"
            : root === "products"
              ? "product"
              : "sale"
        }
        go={go}
      />
    );
  else if (
    ["sales", "purchases", "returns"].includes(root) &&
    parts[1] === "new"
  )
    content = (
      <TransactionForm
        kind={
          root === "purchases"
            ? "purchase"
            : root === "returns"
              ? "return"
              : "sale"
        }
        go={go}
      />
    );
  else if (
    ["customers", "products", "suppliers", "employees", "admin"].includes(
      root,
    ) &&
    parts[1] === "new"
  )
    content = (
      <FormPage
        type={
          root === "admin"
            ? "tenant"
            : root === "employees"
              ? "employee"
              : root === "suppliers"
                ? "supplier"
                : root === "products"
                  ? "product"
                  : "customer"
        }
        go={go}
      />
    );
  else if (root === "inventory" && parts[1] === "movements")
    content = (
      <div className="reveal">
        <PageHeader
          eyebrow="Inventory"
          title="Stock movements"
          description="Every stock change has a reason and a reference."
        />
        <Section title="Movement history">
          <FilterBar
            placeholder="Search movement ID, product or reference"
            options={["Sale", "Purchase", "Return", "Damage"]}
          />
          <Table
            columns={[
              "Movement",
              "Product",
              "Type",
              "Quantity",
              "Reference",
              "Date",
            ]}
            rows={movements}
            renderRow={(row) => (
              <tr key={row.id}>
                <td className="px-5 py-4 font-semibold text-accent">
                  {row.id}
                </td>
                <td className="px-5 py-4">{row.product}</td>
                <td className="px-5 py-4">
                  <Badge>{row.type}</Badge>
                </td>
                <td
                  className={`px-5 py-4 font-bold ${row.quantity > 0 ? "text-success" : "text-danger"}`}
                >
                  {row.quantity > 0 ? "+" : ""}
                  {row.quantity}
                </td>
                <td className="px-5 py-4 text-muted">{row.reference}</td>
                <td className="px-5 py-4 text-muted">{row.date}</td>
              </tr>
            )}
          />
        </Section>
      </div>
    );
  else
    content = (
      <UtilityPage type={root === "settings" ? "settings" : root} go={go} />
    );
  return isAccess ? (
    content
  ) : (
    <Shell pathname={pathname} onNavigate={go}>
      {content}
    </Shell>
  );
}
