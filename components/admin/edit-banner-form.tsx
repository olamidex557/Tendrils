"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  LayoutTemplate,
  Save,
  UploadCloud,
  Eye,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBanner } from "@/lib/actions/banners";
import type { AdminEditBannerRecord } from "@/lib/db/queries/admin-content";

type Props = {
  banner: AdminEditBannerRecord;
};

export default function EditBannerForm({ banner }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: banner.title,
    subtitle: banner.subtitle ?? "",
    ctaText: banner.ctaText ?? "",
    ctaLink: banner.ctaLink ?? "",
    placement: banner.placement,
    status: mapBannerStatusToUi(banner.status),
    imageUrl: banner.imageUrl ?? "",
    priority: String(banner.priority ?? 1),
    schedule: banner.scheduleText ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        await updateBanner(banner.id, {
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || undefined,
          cta_text: form.ctaText.trim() || undefined,
          cta_link: form.ctaLink.trim() || undefined,
          placement: form.placement,
          status: form.status,
          image_url: form.imageUrl.trim() || undefined,
          priority: form.priority ? Number(form.priority) : 1,
          schedule_text: form.schedule.trim() || undefined,
        });

        setMessage("Banner updated successfully.");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to update banner."
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
              href="/admin/banners"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Banners
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Edit Banner
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Update banner content, placement, status, and priority.
            </p>
          </div>

          <Button
            type="submit"
            form="edit-banner-form"
            className="rounded-full bg-black px-5 text-white hover:bg-black/90"
            disabled={isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Updating..." : "Update Banner"}
          </Button>
        </div>
      </div>

      <form
        id="edit-banner-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-6">
          <CardShell
            icon={<LayoutTemplate className="h-5 w-5 text-black" />}
            title="Banner Information"
            subtitle="Update banner content and campaign settings."
          >
            <div className="space-y-5">
              <Field
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Banner title"
                required
              />

              <Field
                label="Subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Banner subtitle"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="CTA Text"
                  name="ctaText"
                  value={form.ctaText}
                  onChange={handleChange}
                  placeholder="Shop Now"
                />
                <Field
                  label="CTA Link"
                  name="ctaLink"
                  value={form.ctaLink}
                  onChange={handleChange}
                  placeholder="/products"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Placement"
                  name="placement"
                  value={form.placement}
                  onChange={handleChange}
                  options={[
                    "Homepage Hero",
                    "Homepage Secondary",
                    "Promo Strip",
                    "Category Banner",
                  ]}
                />
                <SelectField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={["Draft", "Active", "Scheduled"]}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  placeholder="1"
                  type="number"
                />
                <Field
                  label="Schedule"
                  name="schedule"
                  value={form.schedule}
                  onChange={handleChange}
                  placeholder="e.g. Apr 20, 2026"
                />
              </div>
            </div>
          </CardShell>

          <CardShell
            title="Banner Media"
            subtitle="Update banner image."
          >
            <div className="space-y-5">
              <Field
                label="Image URL"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/banner-image.jpg"
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
        </div>

        <div className="space-y-6">
          <CardShell
            icon={<Eye className="h-5 w-5 text-black" />}
            title="Live Preview"
            subtitle="Quick campaign preview."
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
              <div className="relative bg-stone-100">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt={form.title || "Banner preview"}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-stone-400" />
                      <p className="mt-3 text-sm text-stone-500">
                        Banner image preview
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  {form.placement}
                </p>
                <h4 className="text-xl font-semibold text-black">
                  {form.title || "Banner Title"}
                </h4>
                <p className="text-sm text-stone-500">
                  {form.subtitle || "Banner subtitle preview"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                    {form.status}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                    Priority {form.priority}
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
                <p className="text-sm text-stone-500">Editing real banner data</p>
              </div>
            </div>
          </CardShell>
        </div>
      </form>
    </section>
  );
}

function mapBannerStatusToUi(status: "draft" | "active" | "scheduled") {
  if (status === "active") return "Active";
  if (status === "scheduled") return "Scheduled";
  return "Draft";
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
