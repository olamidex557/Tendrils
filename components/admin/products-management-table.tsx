"use client";

import Link from "next/link";
import { Pencil, Trash2, Eye, Layers3, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminProducts = [
  {
    id: "PRD-001",
    name: "Wireless Earbuds",
    category: "Electronics",
    type: "simple",
    variantCount: 0,
    price: 145000,
    stock: 24,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "PRD-002",
    name: "Classic T-Shirt",
    category: "Fashion",
    type: "variable",
    variantCount: 6,
    price: 12000,
    stock: 42,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "PRD-003",
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    type: "simple",
    variantCount: 0,
    price: 199000,
    stock: 12,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "PRD-004",
    name: "Running Sneakers",
    category: "Fashion",
    type: "variable",
    variantCount: 8,
    price: 95000,
    stock: 0,
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "PRD-005",
    name: "Modern Desk Lamp",
    category: "Home Essentials",
    type: "simple",
    variantCount: 0,
    price: 37000,
    stock: 15,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ProductsManagementTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Products" value="128" subtitle="Across all categories" />
        <SummaryCard title="Simple Products" value="74" subtitle="Single price products" />
        <SummaryCard title="Variable Products" value="54" subtitle="With variants/options" />
        <SummaryCard title="Low Stock Alerts" value="9" subtitle="Needs attention" danger />
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Variants</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminProducts.map((product) => (
                <tr key={product.id} className="border-b border-stone-100">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-2xl object-cover bg-stone-100"
                      />

                      <div>
                        <p className="font-semibold text-black">{product.name}</p>
                        <p className="mt-1 text-xs text-stone-500">{product.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {product.category}
                  </td>

                  <td className="px-6 py-5">
                    <TypePill type={product.type} />
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {product.type === "variable" ? `${product.variantCount} variants` : "—"}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-black">
                    ₦{product.price.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <StockPill stock={product.stock} />
                  </td>

                  <td className="px-6 py-5">
                    <StatusPill status={product.status} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <ActionButton ariaLabel="Preview product">
                        <Eye className="h-4 w-4" />
                      </ActionButton>

                      <Button asChild type="button" size="icon" variant="outline" className="rounded-full text-stone-700">
                        <Link href={`/admin/products/${product.id}/edit`} aria-label="Edit product">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>

                      <ActionButton ariaLabel="Delete product" danger>
                        <Trash2 className="h-4 w-4" />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-stone-500">
            Showing 1–{adminProducts.length} of {adminProducts.length} products
          </p>

          <div className="flex items-center gap-2">
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  danger = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <h3 className={`mt-2 text-3xl font-semibold tracking-tight ${danger ? "text-red-600" : "text-black"}`}>
        {value}
      </h3>
      <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function TypePill({ type }: { type: string }) {
  const isVariable = type === "variable";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize ${isVariable
          ? "bg-blue-100 text-blue-700"
          : "bg-stone-100 text-stone-700"
        }`}
    >
      {isVariable ? <Layers3 className="h-3.5 w-3.5" /> : <Box className="h-3.5 w-3.5" />}
      {type}
    </span>
  );
}

function StockPill({ stock }: { stock: number }) {
  const styles =
    stock === 0
      ? "bg-red-100 text-red-700"
      : stock <= 10
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";

  const label =
    stock === 0 ? "Out" : stock <= 10 ? `${stock} low` : `${stock} in stock`;

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "Published"
      ? "bg-green-100 text-green-700"
      : status === "Draft"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function ActionButton({
  children,
  ariaLabel,
  danger = false,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label={ariaLabel}
      className={`rounded-full ${danger ? "text-red-600 hover:text-red-700" : "text-stone-700"
        }`}
    >
      {children}
    </Button>
  );
}

function PaginationButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition ${active
          ? "bg-black text-white"
          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
        }`}
    >
      {children}
    </button>
  );
}
