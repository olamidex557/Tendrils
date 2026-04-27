"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FolderTree,
  ImagePlus,
  Save,
  UploadCloud,
  Star,
  Eye,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCategory } from "@/lib/actions/categories";
import type { AdminEditCategoryRecord } from "@/lib/db/queries/admin-content";
import ImageUploadField from "@/components/admin/image-upload-field";

type Props = {
  category: AdminEditCategoryRecord;
};

export default function EditCategoryForm({ category }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    imageUrl: category.imageUrl ?? "",
    parentCategory: category.parentCategoryId ?? "None",
    visibility: category.isVisible ? "Visible" : "Hidden",
    featured: category.isFeatured,
    sortOrder: String(category.sortOrder ?? 100),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        await updateCategory(category.id, {
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || undefined,
          image_url: form.imageUrl.trim() || undefined,
          parent_category_id:
            form.parentCategory === "None" ? null : form.parentCategory,
          is_featured: form.featured,
          is_visible: form.visibility === "Visible",
          sort_order: form.sortOrder ? Number(form.sortOrder) : 100,
        });

        setMessage("Category updated successfully.");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to update category."
        );
      }
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Edit Category
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Update category details, storefront visibility, and display order.
            </p>
          </div>

          <Button
            type="submit"
            form="edit-category-form"
            className="rounded-full bg-black px-5 text-white hover:bg-black/90"
            disabled={isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </div>

      <form
        id="edit-category-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-6">
          <CardShell
            icon={<FolderTree className="h-5 w-5 text-black" />}
            title="Category Information"
            subtitle="Update category setup and storefront details."
          >
            <div className="space-y-5">
              <Field
                label="Category Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                required
              />

              <Field
                label="Slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="e.g. electronics"
                required
              />

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-black">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none 
transition focus:border-black/30"
                />
              </div>

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

              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <div>
                  <p className="text-sm font-medium text-black">Featured Category</p>
                  <p className="text-sm text-stone-500">
                    Show this category higher on the homepage and category sections.
                  </p>
                </div>
              </label>
            </div>
          </CardShell>

          <CardShell
            title="Category Media"
            subtitle="Update category display image."
          >
            <div className="space-y-5">
              <ImageUploadField
                label="Category Image"
                value={form.imageUrl}
                folder="categories"
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    imageUrl: url,
                  }))
                }
              />
            </div>
          </CardShell>

          {message ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
              {message}
            </div>
          ) : null}
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
                    alt={form.name || "Category preview"}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-stone-400" />
                      <p className="mt-3 text-sm text-stone-500">Category image preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xl font-semibold text-black">
                    {form.name || "Category Name"}
                  </h4>

                  {form.featured ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs 
font-medium text-amber-700">
                      <Star className="h-3.5 w-3.5" />
                      Featured
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-stone-500">
                  {form.description || "Category description preview"}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                    {form.visibility}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                    Order {form.sortOrder || "100"}
                  </span>
                </div>
              </div>
            </div>
          </CardShell>

          <CardShell
            title="Last Updated"
            subtitle="Recent edit metadata preview."
          >
            <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Clock3 className="h-5 w-5 text-stone-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Loaded from database</p>
                <p className="text-sm text-stone-500">Editing real category data</p>
              </div>
            </div>
          </CardShell>
        </div>
      </form>
    </section>
  );
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
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-black">
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
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition 
focus:border-black/30"
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
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-black">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition 
focus:border-black/30"
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
