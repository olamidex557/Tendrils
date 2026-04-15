"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Package,
  Save,
  UploadCloud,
  Plus,
  Trash2,
  Layers3,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/lib/actions/products";

type ProductType = "simple" | "variable";

type AttributeRow = {
  id: string;
  name: string;
  values: string;
};

type VariantRow = {
  id: string;
  label: string;
  sku: string;
  price: string;
  stock: string;
  status: "Active" | "Inactive";
};

const attributePresets = [
  "Size",
  "Color",
  "Storage",
  "Weight",
  "Volume",
  "Material",
];

export default function AdminNewProductPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    comparePrice: "",
    stock: "",
    sku: "",
    status: "Published",
    imageUrl: "",
    shortDescription: "",
    description: "",
    productType: "simple" as ProductType,
  });

  const [attributes, setAttributes] = useState<AttributeRow[]>([
    { id: makeId(), name: "", values: "" },
  ]);

  const [variants, setVariants] = useState<VariantRow[]>([]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function setProductType(type: ProductType) {
    setForm((prev) => ({ ...prev, productType: type }));
  }

  function handleAttributeChange(
    id: string,
    field: keyof Omit<AttributeRow, "id">,
    value: string
  ) {
    setAttributes((prev) =>
      prev.map((attribute) =>
        attribute.id === id ? { ...attribute, [field]: value } : attribute
      )
    );
  }

  function addAttributeRow(preset?: string) {
    setAttributes((prev) => [
      ...prev,
      { id: makeId(), name: preset || "", values: "" },
    ]);
  }

  function removeAttributeRow(id: string) {
    setAttributes((prev) => prev.filter((attribute) => attribute.id !== id));
  }

  function addManualVariant() {
    setVariants((prev) => [
      ...prev,
      {
        id: makeId(),
        label: "",
        sku: "",
        price: "",
        stock: "",
        status: "Active",
      },
    ]);
  }

  function removeVariant(id: string) {
    setVariants((prev) => prev.filter((variant) => variant.id !== id));
  }

  function updateVariant(
    id: string,
    field: keyof Omit<VariantRow, "id">,
    value: string
  ) {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  }

  const normalizedAttributes = useMemo(() => {
    return attributes
      .map((attribute) => ({
        name: attribute.name.trim(),
        values: attribute.values
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      }))
      .filter((attribute) => attribute.name && attribute.values.length > 0);
  }, [attributes]);

  function generateVariantsFromAttributes() {
    if (normalizedAttributes.length === 0) {
      alert("Add at least one attribute with values first.");
      return;
    }

    const combinations = cartesianProduct(
      normalizedAttributes.map((attribute) =>
        attribute.values.map((value) => ({
          attributeName: attribute.name,
          value,
        }))
      )
    );

    const generated: VariantRow[] = combinations.map((combination) => {
      const label = combination.map((item) => item.value).join(" / ");
      const skuSuffix = combination
        .map((item) => item.value.replace(/\s+/g, "-").toUpperCase())
        .join("-");

      return {
        id: makeId(),
        label,
        sku: `${(form.sku || "AJK")
          .replace(/\s+/g, "-")
          .toUpperCase()}-${skuSuffix}`,
        price: "",
        stock: "",
        status: "Active",
      };
    });

    setVariants(generated);
  }

  function resetForm() {
    setForm({
      name: "",
      category: "Electronics",
      price: "",
      comparePrice: "",
      stock: "",
      sku: "",
      status: "Published",
      imageUrl: "",
      shortDescription: "",
      description: "",
      productType: "simple",
    });

    setAttributes([{ id: makeId(), name: "", values: "" }]);
    setVariants([]);
  }

  function mapVariantStatus(
    status: "Active" | "Inactive"
  ): "active" | "inactive" {
    return status === "Active" ? "active" : "inactive";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const payload =
          form.productType === "simple"
            ? {
                name: form.name.trim(),
                category: form.category,
                short_description: form.shortDescription.trim() || undefined,
                description: form.description.trim() || undefined,
                image_url: form.imageUrl.trim() || undefined,
                status: mapProductStatus(form.status),
                product_type: "simple" as const,
                base_price: form.price ? Number(form.price) : null,
                compare_price: form.comparePrice
                  ? Number(form.comparePrice)
                  : null,
                stock_quantity: form.stock ? Number(form.stock) : null,
                sku: form.sku.trim() || null,
                is_featured: false,
              }
            : {
                name: form.name.trim(),
                category: form.category,
                short_description: form.shortDescription.trim() || undefined,
                description: form.description.trim() || undefined,
                image_url: form.imageUrl.trim() || undefined,
                status: mapProductStatus(form.status),
                product_type: "variable" as const,
                base_price: null,
                compare_price: null,
                stock_quantity: null,
                sku: form.sku.trim() || null,
                is_featured: false,
                attributes: normalizedAttributes,
                variants: variants
                  .filter((variant) => variant.label.trim())
                  .map((variant) => ({
                    label: variant.label.trim(),
                    sku: variant.sku.trim() || null,
                    price: variant.price ? Number(variant.price) : null,
                    stock_quantity: variant.stock ? Number(variant.stock) : 0,
                    status: mapVariantStatus(variant.status),
                  })),
              };

        await createProduct(payload);

        setMessage("Product created successfully.");
        resetForm();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create product.";
        setMessage(errorMessage);
      }
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Add New Product
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Build a simple or variable product with a cleaner admin workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-5"
              disabled
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="submit"
              form="new-product-form"
              className="rounded-full bg-black px-5 text-white hover:bg-black/90"
              disabled={isPending}
            >
              {isPending ? "Publishing..." : "Publish Product"}
            </Button>
          </div>
        </div>
      </div>

      <form
        id="new-product-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="space-y-6">
          <CardShell
            icon={<Package className="h-5 w-5 text-black" />}
            title="Product Information"
            subtitle="Basic identity, category, and content."
          >
            <div className="space-y-5">
              <Field
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Earbuds"
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={[
                    "Electronics",
                    "Fashion",
                    "Sports",
                    "Home Essentials",
                    "Grocery",
                    "Beauty",
                    "Skincare",
                  ]}
                />

                <SelectField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={["Published", "Draft", "Out of Stock"]}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black">
                  Product Type
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <TypeCard
                    active={form.productType === "simple"}
                    title="Simple Product"
                    description="One price, one stock quantity, one SKU."
                    onClick={() => setProductType("simple")}
                  />
                  <TypeCard
                    active={form.productType === "variable"}
                    title="Variable Product"
                    description="Use variants like size, color, storage, or weight."
                    onClick={() => setProductType("variable")}
                  />
                </div>
              </div>

              <Field
                label="Short Description"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="A short one-line summary for product cards"
              />

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Full Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write the full product description..."
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
                />
              </div>
            </div>
          </CardShell>

          {form.productType === "simple" ? (
            <CardShell
              title="Pricing & Inventory"
              subtitle="Use this for products without variants."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 145000"
                  type="number"
                  required
                />

                <Field
                  label="Compare At Price"
                  name="comparePrice"
                  value={form.comparePrice}
                  onChange={handleChange}
                  placeholder="e.g. 165000"
                  type="number"
                />

                <Field
                  label="Stock Quantity"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                  type="number"
                  required
                />

                <Field
                  label="SKU"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. AJK-EL-001"
                />
              </div>
            </CardShell>
          ) : (
            <>
              <CardShell
                icon={<Layers3 className="h-5 w-5 text-black" />}
                title="Attributes"
                subtitle="Create reusable option groups for your variants."
              >
                <div className="mb-5 flex flex-wrap gap-2">
                  {attributePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => addAttributeRow(preset)}
                      className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700 transition hover:bg-stone-200 hover:text-black"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {attributes.map((attribute, index) => (
                    <div
                      key={attribute.id}
                      className="rounded-[1.25rem] border border-stone-200 p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-[0.9fr_1.5fr_auto]">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Attribute Name
                          </label>
                          <input
                            type="text"
                            value={attribute.name}
                            onChange={(e) =>
                              handleAttributeChange(
                                attribute.id,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder={
                              index === 0 ? "e.g. Size" : "e.g. Color"
                            }
                            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Values
                          </label>
                          <input
                            type="text"
                            value={attribute.values}
                            onChange={(e) =>
                              handleAttributeChange(
                                attribute.id,
                                "values",
                                e.target.value
                              )
                            }
                            placeholder="Comma separated values, e.g. S, M, L"
                            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeAttributeRow(attribute.id)}
                            className="h-12 w-12 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {attribute.values ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {attribute.values
                            .split(",")
                            .map((value) => value.trim())
                            .filter(Boolean)
                            .map((value) => (
                              <span
                                key={value}
                                className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
                              >
                                {value}
                              </span>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-5"
                    onClick={() => addAttributeRow()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attribute
                  </Button>

                  <Button
                    type="button"
                    className="rounded-full bg-black px-5 text-white hover:bg-black/90"
                    onClick={generateVariantsFromAttributes}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Variants
                  </Button>
                </div>
              </CardShell>

              <CardShell
                title="Variants"
                subtitle="Set details for each variant combination."
              >
                {variants.length === 0 ? (
                  <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                    <p className="text-sm font-medium text-black">
                      No variants yet
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      Add attributes above, then generate combinations or add
                      manual rows.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-5 rounded-full px-5"
                      onClick={addManualVariant}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant Row
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-[1.25rem] bg-stone-50 px-4 py-3 text-sm text-stone-600">
                      {variants.length} variant
                      {variants.length > 1 ? "s" : ""} ready to configure
                    </div>

                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="rounded-[1.25rem] border border-stone-200 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-black">
                            {variant.label || "New Variant"}
                          </p>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeVariant(variant.id)}
                            className="h-10 w-10 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <MiniField
                            label="Variant Label"
                            value={variant.label}
                            onChange={(value) =>
                              updateVariant(variant.id, "label", value)
                            }
                            placeholder="e.g. Black / M"
                          />
                          <MiniField
                            label="SKU"
                            value={variant.sku}
                            onChange={(value) =>
                              updateVariant(variant.id, "sku", value)
                            }
                            placeholder="e.g. AJK-BLK-M"
                          />
                          <MiniField
                            label="Price"
                            value={variant.price}
                            onChange={(value) =>
                              updateVariant(variant.id, "price", value)
                            }
                            placeholder="12000"
                            type="number"
                          />
                          <MiniField
                            label="Stock"
                            value={variant.stock}
                            onChange={(value) =>
                              updateVariant(variant.id, "stock", value)
                            }
                            placeholder="8"
                            type="number"
                          />
                        </div>

                        <div className="mt-4 max-w-[220px]">
                          <label className="mb-2 block text-sm font-medium text-black">
                            Status
                          </label>
                          <select
                            value={variant.status}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "status",
                                e.target.value
                              )
                            }
                            className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-5"
                      onClick={addManualVariant}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant Row
                    </Button>
                  </div>
                )}
              </CardShell>
            </>
          )}

          <CardShell
            title="Media"
            subtitle="Add a main image URL for product preview."
          >
            <div className="space-y-5">
              <Field
                label="Image URL"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
              />

              <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <UploadCloud className="h-6 w-6 text-stone-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-black">
                  Upload support can be added next
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  For now, paste an image URL above for preview.
                </p>
              </div>
            </div>
          </CardShell>

          {message ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
              {message}
            </div>
          ) : null}

          <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  Ready to save this product?
                </p>
                <p className="text-sm text-stone-500">
                  Review the preview and publish when ready.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  disabled
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-black px-5 text-white hover:bg-black/90"
                  disabled={isPending}
                >
                  {isPending ? "Publishing..." : "Publish Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CardShell
            title="Live Preview"
            subtitle="Quick storefront-style preview."
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
              <div className="relative bg-stone-100">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt={form.name || "Product preview"}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-stone-400" />
                      <p className="mt-3 text-sm text-stone-500">
                        Product image preview
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-stone-500">
                    {form.category || "Category"}
                  </p>
                  <h4 className="mt-2 text-xl font-semibold text-black">
                    {form.name || "Product Name"}
                  </h4>
                  <p className="mt-2 text-sm text-stone-500">
                    {form.shortDescription ||
                      "Short product description preview"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-black">
                    ₦
                    {form.productType === "simple"
                      ? form.price
                        ? Number(form.price).toLocaleString()
                        : "0"
                      : variants[0]?.price
                      ? Number(variants[0].price).toLocaleString()
                      : "0"}
                  </p>

                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-700">
                    {form.productType}
                  </span>
                </div>
              </div>
            </div>
          </CardShell>

          <CardShell
            title="Setup Summary"
            subtitle="A quick overview before saving."
          >
            <div className="space-y-3">
              <SummaryRow label="Type" value={form.productType} />
              <SummaryRow label="Category" value={form.category || "—"} />
              <SummaryRow
                label="Attributes"
                value={String(normalizedAttributes.length)}
              />
              <SummaryRow label="Variants" value={String(variants.length)} />
              <SummaryRow label="Status" value={form.status} />
            </div>
          </CardShell>

          <CardShell
            title="Configuration Tips"
            subtitle="Helpful guidance for your product setup."
          >
            <ul className="space-y-3 text-sm leading-7 text-stone-600">
              <li>• Use simple products for one-price, one-stock items.</li>
              <li>
                • Use variable products for size, color, storage, or volume
                options.
              </li>
              <li>• Attribute values should be comma separated.</li>
              <li>• Generate variants after setting your attributes.</li>
              <li>• Each variant can have its own SKU, price, and stock.</li>
            </ul>
          </CardShell>

          <div className="rounded-[1.5rem] border border-black/5 bg-stone-900 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Next Step</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/80">
              After creation works, the next move is replacing storefront mock
              data with real Supabase products and categories.
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}

function mapProductStatus(
  status: string
): "published" | "draft" | "out_of_stock" {
  if (status === "Published") return "published";
  if (status === "Draft") return "draft";
  return "out_of_stock";
}

function CardShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
            {icon}
          </div>
        ) : null}
        <div>
          <h3 className="text-xl font-semibold text-black">{title}</h3>
          <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function TypeCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.25rem] border p-5 text-left transition ${
        active
          ? "border-black bg-stone-900 text-white"
          : "border-stone-200 bg-white text-black hover:border-black/20"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold">{title}</h4>
        <ChevronRight
          className={`h-4 w-4 ${active ? "text-white" : "text-stone-400"}`}
        />
      </div>
      <p
        className={`mt-2 text-sm leading-6 ${
          active ? "text-white/80" : "text-stone-600"
        }`}
      >
        {description}
      </p>
    </button>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-black"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
      />
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-black"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm capitalize outline-none transition focus:border-black/30"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-sm font-semibold capitalize text-black">
        {value}
      </span>
    </div>
  );
}

function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [];
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]]
  );
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}