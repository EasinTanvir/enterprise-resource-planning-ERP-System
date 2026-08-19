"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Minus, Plus, Save, X } from "lucide-react";
import { getTenantData } from "@/lib/erp-data";

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});
const formatMoney = (value) => money.format(value).replace("BDT", "৳");
const roles = [
  "Super Admin",
  "Tenant Admin",
  "Manager",
  "Sales Employee",
  "Inventory Employee",
];
const permissions = [
  "customers.view",
  "customers.create",
  "products.view",
  "sales.create",
  "inventory.adjust",
  "users.manage",
  "settings.update",
];
const configs = {
  customers: {
    title: "Customer",
    fields: [
      ["name", "Full name", "text", true],
      ["phone", "Phone", "tel", true],
      ["email", "Email", "email"],
      ["address", "Address", "text"],
      ["status", "Status", "select", true, ["Active", "Inactive"]],
    ],
  },
  products: {
    title: "Product",
    fields: [
      ["name", "Product name", "text", true],
      ["sku", "SKU", "text", true],
      ["description", "Description", "textarea"],
      [
        "category",
        "Category",
        "select",
        true,
        ["Smartphones", "Laptops", "Tablets", "Accessories", "Audio"],
      ],
      ["purchasePrice", "Purchase price", "number", true],
      ["sellingPrice", "Selling price", "number", true],
      ["reorderLevel", "Reorder level", "number", true],
      ["status", "Status", "select", true, ["Active", "Inactive"]],
    ],
  },
  categories: {
    title: "Category",
    fields: [
      ["name", "Category name", "text", true],
      ["description", "Description", "textarea"],
      ["status", "Status", "select", true, ["Active", "Inactive"]],
    ],
  },
  suppliers: {
    title: "Supplier",
    fields: [
      ["name", "Supplier name", "text", true],
      ["phone", "Phone", "tel", true],
      ["email", "Email", "email"],
      ["address", "Address", "text"],
      ["status", "Status", "select", true, ["Active", "Inactive"]],
    ],
  },
  employees: {
    title: "Employee",
    fields: [
      ["name", "Full name", "text", true],
      ["email", "Email", "email", true],
      ["phone", "Phone", "tel"],
      ["role", "Role", "select", true, roles],
      ["status", "Status", "select", true, ["Active", "Inactive"]],
      [
        "invitation",
        "Invitation",
        "select",
        true,
        ["Pending", "Sent", "Accepted"],
      ],
    ],
  },
  roles: {
    title: "Role",
    fields: [
      ["name", "Role name", "text", true],
      ["description", "Description", "textarea"],
    ],
  },
  company: {
    title: "Company settings",
    fields: [
      ["name", "Company name", "text", true],
      ["email", "Email", "email"],
      ["phone", "Phone", "tel"],
      ["address", "Address", "text"],
      ["website", "Website", "url"],
      ["currency", "Currency", "select", true, ["BDT", "USD"]],
    ],
  },
  invoice: {
    title: "Invoice settings",
    fields: [
      ["prefix", "Invoice prefix", "text", true],
      ["footer", "Invoice footer", "textarea"],
      ["numbering", "Next invoice number", "number", true],
    ],
  },
  tax: {
    title: "Tax settings",
    fields: [
      ["enabled", "Tax status", "select", true, ["Enabled", "Disabled"]],
      ["rate", "Tax rate (%)", "number", true],
      ["label", "Tax label", "text", true],
    ],
  },
  profile: {
    title: "Profile settings",
    fields: [
      ["name", "Full name", "text", true],
      ["email", "Email", "email", true],
      ["phone", "Phone", "tel"],
      ["password", "New password", "password"],
    ],
  },
};

function Field({ register, errors, field }) {
  const [name, label, type, required, options] = field;
  const common = {
    ...register(name, {
      required: required ? `${label} is required` : false,
      ...(type === "email"
        ? {
            pattern: {
              value: /\\S+@\\S+\\.\\S+/,
              message: "Enter a valid email",
            },
          }
        : {}),
      ...(type === "number"
        ? { min: { value: 0, message: "Value cannot be negative" } }
        : {}),
    }),
  };
  return (
    <label className="block text-sm font-semibold">
      {label}
      {type === "textarea" ? (
        <textarea
          {...common}
          className="mt-2 min-h-28 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
        />
      ) : type === "select" ? (
        <select
          {...common}
          className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-accent"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={type}
          className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
        />
      )}
      {errors[name] && (
        <span className="mt-1 block text-xs font-normal text-danger">
          {errors[name].message}
        </span>
      )}
    </label>
  );
}
function Layout({ title, description, children }) {
  return (
    <div className="reveal">
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-accent">
          Action form
        </p>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function DomainForm({
  type,
  subdomain,
  mode = "create",
  action,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [lines, setLines] = useState([
    { product: "iPhone 15 128GB", quantity: 1, price: 89900 },
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const data = subdomain ? getTenantData(subdomain) : null;
  if (["purchase", "sale", "return"].includes(type))
    return (
      <TransactionForm
        type={type}
        subdomain={subdomain}
        mode={mode}
        action={action}
      />
    );
  if (
    [
      "adjust",
      "payment",
      "receive",
      "approve",
      "license",
      "administrator",
      "invoice-pdf",
    ].includes(type)
  )
    return <ActionForm type={type} subdomain={subdomain} />;
  const config = configs[type] || configs.customers;
  const title = `${mode === "edit" ? "Edit" : "New"} ${config.title}`;
  return (
    <Layout
      title={title}
      description={`${title} for ${data?.tenant.name || "your organization"}. Changes are stored in local dummy UI state.`}
    >
      <form
        onSubmit={handleSubmit(() => setSubmitted(true))}
        className="max-w-4xl rounded-lg border border-line bg-panel p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <Field
              key={field[0]}
              field={field}
              register={register}
              errors={errors}
            />
          ))}
        </div>
        {type === "roles" && (
          <div className="mt-6 rounded-md border border-line p-4">
            <h3 className="font-bold">Permissions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {permissions.map((permission) => (
                <label
                  className="flex items-center gap-2 text-sm"
                  key={permission}
                >
                  <input
                    type="checkbox"
                    defaultChecked={
                      permission.endsWith(".view") ||
                      permission === "sales.create"
                    }
                    {...register(`permissions.${permission}`)}
                  />
                  {permission}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={subdomain ? "/" : "/admin/tenants"}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-muted"
          >
            Cancel
          </Link>
          <button
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Save size={16} />
            {isSubmitting ? "Saving..." : `Save ${config.title.toLowerCase()}`}
          </button>
        </div>
        {submitted && (
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
            <Check size={16} />
            Saved in local dummy state.
          </p>
        )}
      </form>
    </Layout>
  );
}

function TransactionForm({ type, subdomain, mode, action }) {
  const [submitted, setSubmitted] = useState(false);
  const [lines, setLines] = useState([
    { product: "iPhone 15 128GB", quantity: 1, price: 89900 },
    { product: "AirPods Pro (2nd gen)", quantity: 1, price: 26900 },
  ]);
  const { register, handleSubmit } = useForm();
  const total = lines.reduce(
    (sum, line) => sum + Number(line.quantity) * Number(line.price),
    0,
  );
  const title =
    action === "receive"
      ? "Receive purchase"
      : action === "approve"
        ? "Review return"
        : `${mode === "edit" ? "Edit" : "New"} ${type}`;
  return (
    <Layout
      title={title}
      description={`Complete the ${type} workflow with explicit quantities, prices, and status changes.`}
    >
      <form
        onSubmit={handleSubmit(() => setSubmitted(true))}
        className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
      >
        <section className="rounded-lg border border-line bg-panel p-6">
          <h3 className="font-bold">
            {type === "sale"
              ? "Customer and sale details"
              : type === "purchase"
                ? "Supplier and purchase details"
                : "Original sale and return details"}
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              {type === "sale"
                ? "Customer"
                : type === "purchase"
                  ? "Supplier"
                  : "Original sale"}
              <input
                required
                {...register("party")}
                className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal outline-none focus:border-accent"
                placeholder={type === "return" ? "SAL-1048" : "Search records"}
              />
            </label>
            <label className="text-sm font-semibold">
              Status
              <select
                {...register("status")}
                className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-accent"
              >
                {(type === "purchase"
                  ? ["Draft", "Confirmed", "Received", "Cancelled"]
                  : type === "return"
                    ? [
                        "Pending",
                        "Approved",
                        "Rejected",
                        "Restocked",
                        "Refunded",
                      ]
                    : ["Draft", "Confirmed", "Cancelled"]
                ).map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Line items</h3>
              <button
                type="button"
                onClick={() =>
                  setLines([
                    ...lines,
                    { product: "New product", quantity: 1, price: 0 },
                  ])
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent"
              >
                <Plus size={14} />
                Add line
              </button>
            </div>
            {lines.map((line, index) => (
              <div
                className="grid gap-2 rounded-md border border-line p-3 sm:grid-cols-[1fr_90px_120px_auto]"
                key={index}
              >
                <input
                  value={line.product}
                  onChange={(event) =>
                    setLines(
                      lines.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, product: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="rounded-md border border-line px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(event) =>
                    setLines(
                      lines.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, quantity: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="rounded-md border border-line px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={line.price}
                  onChange={(event) =>
                    setLines(
                      lines.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, price: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="rounded-md border border-line px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={lines.length === 1}
                  onClick={() =>
                    setLines(
                      lines.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="grid place-items-center rounded-md border border-line text-muted"
                  aria-label="Remove line"
                >
                  <Minus size={15} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Discount
              <input
                type="number"
                min="0"
                defaultValue="0"
                {...register("discount")}
                className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal"
              />
            </label>
            <label className="text-sm font-semibold">
              Tax (%)
              <input
                type="number"
                min="0"
                defaultValue="0"
                {...register("tax")}
                className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal"
              />
            </label>
          </div>
        </section>
        <aside className="h-fit rounded-lg border border-line bg-panel p-6">
          <h3 className="font-bold">Summary</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <b>{formatMoney(total)}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment method</span>
              <select
                {...register("paymentMethod")}
                className="rounded border border-line px-2 py-1 text-xs"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Mobile Banking</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <span>Total</span>
              <b>{formatMoney(total)}</b>
            </div>
          </div>
          <button className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            {action === "receive"
              ? "Receive stock"
              : action === "approve"
                ? "Approve return"
                : "Save draft"}
          </button>
          {submitted && (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
              <Check size={16} />
              Workflow updated locally.
            </p>
          )}
        </aside>
      </form>
    </Layout>
  );
}

function ActionForm({ type, subdomain }) {
  const [submitted, setSubmitted] = useState(false);
  const labels = {
    adjust: [
      "Stock adjustment",
      "Product, direction, quantity, reason, reference, and notes.",
    ],
    payment: [
      "Record payment",
      "Link a full or partial payment to a sale or invoice.",
    ],
    receive: [
      "Receive purchase",
      "Record received quantities and increase stock only after receiving.",
    ],
    approve: [
      "Review return",
      "Approve or reject a return after validating the original sale.",
    ],
    license: [
      "Manage lifetime license",
      "Set the organization license to Active, Suspended, or Revoked.",
    ],
    administrator: [
      "Manage tenant administrator",
      "Invite, update, deactivate, or assign a tenant administrator.",
    ],
    "invoice-pdf": [
      "Invoice preview",
      "Review the printable invoice and payment status.",
    ],
  };
  const [title, description] = labels[type];
  return (
    <Layout title={title} description={description}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="max-w-3xl rounded-lg border border-line bg-panel p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Reference
            <input
              required
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal"
              placeholder={type === "payment" ? "INV-10047" : "Reference"}
            />
          </label>
          <label className="text-sm font-semibold">
            Status
            <select className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2.5 font-normal">
              {(type === "license"
                ? ["Active", "Suspended", "Revoked"]
                : type === "approve"
                  ? ["Approved", "Rejected"]
                  : ["Pending", "Completed"]
              ).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Amount or quantity
            <input
              type="number"
              min="0"
              className="mt-2 w-full rounded-md border border-line px-3 py-2.5 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            Reason / notes
            <textarea className="mt-2 min-h-24 w-full rounded-md border border-line px-3 py-2.5 font-normal" />
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <Link
            href={subdomain ? "/" : "/admin/tenants"}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-muted"
          >
            Cancel
          </Link>
          <button className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            Save change
          </button>
        </div>
        {submitted && (
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
            <Check size={16} />
            Change saved in local dummy state.
          </p>
        )}
      </form>
    </Layout>
  );
}
