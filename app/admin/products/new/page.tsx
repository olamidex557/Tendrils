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
  ChevronRight,
  Eye,
  Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/lib/actions/products";

type ProductType = "simple" | "variable";

type AttributeRow = {
  id: string;
  name: string;
  values: string;
};

type MatrixCell = {
  id: string;
  size: string;
  color: string;
  stock: string;
  isActive: boolean;
};

const attributePresets = ["Size", "Color", "Material"];

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
    visibility: "Visible",
    featured: false,
    sortOrder: "100",
    imageUrl: "",
    shortDescription: "",
    description: "",
    productType: "simple" as ProductType,
  });

  const [attributes, setAttributes] = useState<AttributeRow[]>([
    { id: makeId(), name: "Size", values: "" },
    { id: makeId(), name: "Color", values: "" },
  ]);

  const [matrixCells, setMatrixCells] = useState<MatrixCell[]>([]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

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

  const sizeValues = useMemo(() => {
    return (
      normalizedAttributes.find(
        (attribute) => attribute.name.toLowerCase() === "size"
      )?.values ?? []
    );
  }, [normalizedAttributes]);

  const colorValues = useMemo(() => {
    return (
      normalizedAttributes.find(
        (attribute) => attribute.name.toLowerCase() === "color"
      )?.values ?? []
    );
  }, [normalizedAttributes]);

  function regenerateMatrix() {
    if (sizeValues.length === 0) {
      setMessage("Add Size values before generating the matrix.");
      return;
    }

    if (colorValues.length === 0) {
      setMessage("Add Color values before generating the matrix.");
      return;
    }

    setMatrixCells((prev) => {
      const next: MatrixCell[] = [];

      for (const size of sizeValues) {
        for (const color of colorValues) {
          const existing = prev.find(
            (cell) => cell.size === size && cell.color === color
          );

          next.push({
            id: existing?.id ?? makeId(),
            size,
            color,
            stock: existing?.stock ?? "",
            isActive: existing?.isActive ?? true,
          });
        }
      }

      return next;
    });

    setMessage("");
  }

  function updateMatrixCell(
    id: string,
    field: keyof Omit<MatrixCell, "id" | "size" | "color">,
    value: string | boolean
  ) {
    setMatrixCells((prev) =>
      prev.map((cell) => (cell.id === id ? { ...cell, [field]: value } : cell))
    );
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
      visibility: "Visible",
      featured: false,
      sortOrder: "100",
      imageUrl: "",
      shortDescription: "",
      description: "",
      productType: "simple",
    });

    setAttributes([
      { id: makeId(), name: "Size", values: "" },
      { id: makeId(), name: "Color", values: "" },
    ]);
    setMatrixCells([]);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const cleanedMatrix = matrixCells.map((cell) => ({
          size: cell.size,
          color: cell.color,
          stock_quantity: cell.stock.trim() === "" ? 0 : Number(cell.stock),
          is_active: cell.isActive,
        }));

        if (form.productType === "variable") {
          if (sizeValues.length === 0) {
            setMessage("Add at least one Size value.");
            return;
          }

          if (colorValues.length === 0) {
            setMessage("Add at least one Color value.");
            return;
          }

          if (cleanedMatrix.length === 0) {
            setMessage("Generate the stock matrix before saving.");
            return;
          }
        }

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
                is_featured: form.featured,
                is_visible: form.visibility === "Visible",
                sort_order: form.sortOrder ? Number(form.sortOrder) : 100,
              }
            : {
                name: form.name.trim(),
                category: form.category,
                short_description: form.shortDescription.trim() || undefined,
                description: form.description.trim() || undefined,
                image_url: form.imageUrl.trim() || undefined,
                status: mapProductStatus(form.status),
                product_type: "variable" as const,
                base_price: form.price ? Number(form.price) : null,
                compare_price: form.comparePrice
                  ? Number(form.comparePrice)
                  : null,
                stock_quantity: null,
                sku: form.sku.trim() || null,
                is_featured: form.featured,
                is_visible: form.visibility === "Visible",
                sort_order: form.sortOrder ? Number(form.sortOrder) : 100,
                attributes: normalizedAttributes,
                inventoryMatrix: cleanedMatrix,
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

  const matrixRowCount = sizeValues.length;
  const matrixColumnCount = colorValues.length;
  const totalMatrixCells = matrixCells.length;

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
              Create a storefront-ready product with pricing, inventory, and
              matrix stock controls.
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
                placeholder="e.g. Plain Tee"
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
                    title="Matrix Product"
                    description="Use Size × Color stock matrix with automatic SKU generation."
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

          <CardShell
            title="Pricing"
            subtitle={
              form.productType === "simple"
                ? "Use this for products without options."
                : "Set one base price for all size and color combinations."
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Price"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 120000"
                type="number"
                required
              />

              <Field
                label="Compare At Price"
                name="comparePrice"
                value={form.comparePrice}
                onChange={handleChange}
                placeholder="e.g. 145000"
                type="number"
              />

              {form.productType === "simple" ? (
                <Field
                  label="Stock Quantity"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="e.g. 24"
                  type="number"
                  required
                />
              ) : null}

              <Field
                label={
                  form.productType === "simple" ? "SKU" : "Base SKU Prefix"
                }
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder={
                  form.productType === "simple"
                    ? "e.g. TEE-001"
                    : "e.g. TEE"
                }
              />
            </div>
          </CardShell>

          {form.productType === "variable" ? (
            <>
              <CardShell
                icon={<Grid3X3 className="h-5 w-5 text-black" />}
                title="Attributes"
                subtitle="Set Size and Color values, then generate the stock matrix."
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
                    onClick={regenerateMatrix}
                  >
                    Generate Stock Matrix
                  </Button>
                </div>
              </CardShell>

              <CardShell
                title="Inventory Matrix"
                subtitle="Set stock for every Size × Color combination. SKU is generated automatically."
              >
                {sizeValues.length === 0 || colorValues.length === 0 ? (
                  <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                    <p className="text-sm font-medium text-black">
                      Size and Color are required
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      Add Size and Color values above, then generate the matrix.
                    </p>
                  </div>
                ) : matrixCells.length === 0 ? (
                  <div className="rounded-[1.25rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                    <p className="text-sm font-medium text-black">
                      No matrix generated yet
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      Click “Generate Stock Matrix” to create stock cells for each size and color combination.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-[1.25rem] bg-stone-50 px-4 py-3 text-sm text-stone-600">
                      {matrixRowCount} size row{matrixRowCount !== 1 ? "s" : ""} ×{" "}
                      {matrixColumnCount} color column
                      {matrixColumnCount !== 1 ? "s" : ""} = {totalMatrixCells} stock cell
                      {totalMatrixCells !== 1 ? "s" : ""}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border-separate border-spacing-2">
                        <thead>
                          <tr>
                            <th className="rounded-2xl bg-stone-100 px-4 py-3 text-left text-sm font-semibold text-black">
                              Size
                            </th>
                            {colorValues.map((color) => (
                              <th
                                key={color}
                                className="rounded-2xl bg-stone-100 px-4 py-3 text-center text-sm font-semibold text-black"
                              >
                                {color}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {sizeValues.map((size) => (
                            <tr key={size}>
                              <td className="rounded-2xl bg-stone-50 px-4 py-3 text-sm font-semibold text-black">
                                {size}
                              </td>

                              {colorValues.map((color) => {
                                const cell = matrixCells.find(
                                  (entry) =>
                                    entry.size === size && entry.color === color
                                );

                                if (!cell) {
                                  return (
                                    <td
                                      key={`${size}-${color}`}
                                      className="rounded-2xl border border-dashed border-stone-200 px-3 py-3 text-center text-xs text-stone-400"
                                    >
                                      —
                                    </td>
                                  );
                                }

                                return (
                                  <td
                                    key={`${size}-${color}`}
                                    className="rounded-2xl border border-stone-200 p-3 align-top"
                                  >
                                    <div className="space-y-3">
                                      <input
                                        type="number"
                                        min="0"
                                        value={cell.stock}
                                        onChange={(e) =>
                                          updateMatrixCell(
                                            cell.id,
                                            "stock",
                                            e.target.value
                                          )
                                        }
                                        placeholder="0"
                                        className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none transition focus:border-black/30"
                                      />

                                      <label className="flex items-center gap-2 text-xs text-stone-600">
                                        <input
                                          type="checkbox"
                                          checked={cell.isActive}
                                          onChange={(e) =>
                                            updateMatrixCell(
                                              cell.id,
                                              "isActive",
                                              e.target.checked
                                            )
                                          }
                                          className="h-4 w-4"
                                        />
                                        Active
                                      </label>

                                      <p className="text-[11px] text-stone-400">
                                        SKU: Auto
                                      </p>
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardShell>
            </>
          ) : null}

          <CardShell
            title="Storefront Controls"
            subtitle="Decide where and how this product appears."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Visibility"
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                options={["Visible", "Hidden"]}
              />

              <Field
                label="Sort Order"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                placeholder="100"
                type="number"
              />
            </div>

            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <div>
                <p className="text-sm font-medium text-black">Featured Product</p>
                <p className="text-sm text-stone-500">
                  Show this product higher in homepage and storefront featured sections.
                </p>
              </div>
            </label>
          </CardShell>

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
            icon={<Eye className="h-5 w-5 text-black" />}
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
                    {form.price ? Number(form.price).toLocaleString() : "0"}
                  </p>

                  <div className="flex gap-2">
                    {form.featured ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Featured
                      </span>
                    ) : null}

                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-700">
                      {form.visibility}
                    </span>
                  </div>
                </div>

                {form.productType === "variable" ? (
                  <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
                    {sizeValues.length} size option{sizeValues.length !== 1 ? "s" : ""},{" "}
                    {colorValues.length} color option{colorValues.length !== 1 ? "s" : ""}
                  </div>
                ) : null}
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
              <SummaryRow
                label="Matrix Cells"
                value={String(matrixCells.length)}
              />
              <SummaryRow label="Status" value={form.status} />
              <SummaryRow label="Visibility" value={form.visibility} />
              <SummaryRow
                label="Featured"
                value={form.featured ? "Yes" : "No"}
              />
              <SummaryRow label="Sort Order" value={form.sortOrder || "100"} />
            </div>
          </CardShell>
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

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}