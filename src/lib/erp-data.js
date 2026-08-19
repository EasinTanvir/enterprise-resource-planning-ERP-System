const tenantProfiles = {
  abc: {
    slug: "abc",
    name: "Apple Gadget BD",
    location: "Dhanmondi, Dhaka",
    accent: "Coral",
    customers: 248,
    products: 86,
    sales: 128,
    revenue: 1842500,
    lowStock: 7,
    staff: 12,
  },
  xyz: {
    slug: "xyz",
    name: "Dazzle BD",
    location: "Gulshan, Dhaka",
    accent: "Saffron",
    customers: 193,
    products: 64,
    sales: 94,
    revenue: 1298400,
    lowStock: 5,
    staff: 9,
  },
};

const baseProducts = [
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
];

const baseCustomers = [
  {
    id: "c-1",
    name: "Nafis Rahman",
    phone: "+880 1712 445 891",
    email: "nafis@example.com",
    spent: 238400,
    status: "Active",
  },
  {
    id: "c-2",
    name: "Maliha Chowdhury",
    phone: "+880 1819 201 774",
    email: "maliha@example.com",
    spent: 156900,
    status: "Active",
  },
  {
    id: "c-3",
    name: "Rafi Ahmed",
    phone: "+880 1611 008 328",
    email: "rafi@example.com",
    spent: 87900,
    status: "Active",
  },
  {
    id: "c-4",
    name: "Tasnim Haque",
    phone: "+880 1914 776 215",
    email: "tasnim@example.com",
    spent: 46200,
    status: "Inactive",
  },
];

const platformTenants = [
  {
    id: "tenant-abc",
    name: "Apple Gadget BD",
    slug: "abc",
    owner: "Ayesha Karim",
    status: "Active",
    license: "Lifetime",
    joined: "12 Jan 2026",
    users: 12,
  },
  {
    id: "tenant-xyz",
    name: "Dazzle BD",
    slug: "xyz",
    owner: "Mahmud Hasan",
    status: "Active",
    license: "Lifetime",
    joined: "03 Feb 2026",
    users: 9,
  },
];

export function getTenant(slug) {
  return (
    tenantProfiles[slug] || {
      ...tenantProfiles.abc,
      slug,
      name: `${slug.toUpperCase()} Retail`,
      location: "Dhaka, Bangladesh",
    }
  );
}

export function getTenantData(slug) {
  const tenant = getTenant(slug);
  const multiplier = tenant.slug === "xyz" ? 0.82 : 1;
  return {
    tenant,
    products: baseProducts.map((item, index) => ({
      ...item,
      stock: Math.max(
        0,
        Math.round(item.stock * multiplier) +
          (index === 1 && tenant.slug === "xyz" ? 2 : 0),
      ),
    })),
    customers: baseCustomers.map((item, index) => ({
      ...item,
      spent:
        Math.round(item.spent * multiplier) +
        (tenant.slug === "xyz" ? index * 1200 : 0),
    })),
    movements: [
      {
        id: "mov-1",
        product: "iPhone 15 128GB",
        type: "Sale",
        quantity: -2,
        reference: "SAL-1048",
        date: "Today, 10:42 AM",
      },
      {
        id: "mov-2",
        product: "AirPods Pro (2nd gen)",
        type: "Purchase",
        quantity: 24,
        reference: "PUR-208",
        date: "Yesterday",
      },
      {
        id: "mov-3",
        product: "Galaxy S24 Ultra",
        type: "Adjustment",
        quantity: -1,
        reference: "ADJ-019",
        date: "18 Aug 2026",
      },
    ],
    sales: [
      {
        id: "SAL-1048",
        customer: "Nafis Rahman",
        total: Math.round(179800 * multiplier),
        status: "Paid",
        date: "19 Aug 2026",
      },
      {
        id: "SAL-1047",
        customer: "Maliha Chowdhury",
        total: Math.round(26900 * multiplier),
        status: "Paid",
        date: "18 Aug 2026",
      },
      {
        id: "SAL-1046",
        customer: "Rafi Ahmed",
        total: Math.round(124900 * multiplier),
        status: "Partial",
        date: "18 Aug 2026",
      },
    ],
    invoices: [
      {
        id: "INV-10048",
        customer: "Nafis Rahman",
        total: Math.round(179800 * multiplier),
        status: "Paid",
        date: "19 Aug 2026",
      },
      {
        id: "INV-10047",
        customer: "Rafi Ahmed",
        total: Math.round(124900 * multiplier),
        status: "Unpaid",
        date: "18 Aug 2026",
      },
    ],
    staff: [
      {
        id: "u-1",
        name: "Ayesha Karim",
        role: "Tenant Admin",
        status: "Active",
      },
      {
        id: "u-2",
        name: "Sabbir Hossain",
        role: "Sales Employee",
        status: "Active",
      },
      {
        id: "u-3",
        name: "Nusrat Jahan",
        role: "Inventory Employee",
        status: "Active",
      },
    ],
  };
}

export { platformTenants };
