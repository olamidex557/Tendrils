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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBanner } from "@/lib/actions/banners";
import ImageUploadField from "@/components/admin/image-upload-field";

const placementOptions = [
  { label: "Homepage Hero", value: "homepage_hero" },
  { label: "Homepage Secondary", value: "homepage_secondary" },
  { label: "Promo Strip", value: "promo_strip" },
  { label: "Category Banner", value: "category_banner" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
  { label: "Scheduled", value: "Scheduled" },
];

function getPlacementLabel(value: string) {
  return (
    placementOptions.find((option) => option.value === value)?.label ?? value
  );
}

export default function AdminNewBannerPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    placement: "homepage_hero",
    status: "Active",
    imageUrl: "",
    priority: "1",
    schedule: "",
    startsAt: "",
    endsAt: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function getSubmitLabel() {
    if (isPending) {
      if (form.status === "Draft") return "Saving Draft...";
      if (form.status === "Scheduled") return "Scheduling...";
      return "Publishing...";
    }

    if (form.status === "Draft") return "Save Draft";
    if (form.status === "Scheduled") return "Schedule Banner";
    return "Publish Banner";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        await createBanner({
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || undefined,
          cta_text: form.ctaText.trim() || undefined,
          cta_link: form.ctaLink.trim() || undefined,
          placement: form.placement,
          status: form.status,
          image_url: form.imageUrl.trim() || undefined,
          priority: form.priority ? Number(form.priority) : 1,
          schedule_text: form.schedule.trim() || undefined,
          starts_at: toIsoFromDatetimeLocal(form.startsAt),
          ends_at: toIsoFromDatetimeLocal(form.endsAt),
        });

        setMessage(
          form.status === "Active"
            ? "Banner published successfully."
            : form.status === "Scheduled"
              ? "Banner scheduled successfully."
              : "Banner draft saved successfully."
        );

        setForm({
          title: "",
          subtitle: "",
          ctaText: "",
          ctaLink: "",
          placement: "homepage_hero",
          status: "Active",
          imageUrl: "",
          priority: "1",
          schedule: "",
          startsAt: "",
          endsAt: "",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create banner.";
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
              href="/admin/banners"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Banners
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Add New Banner
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Create a banner for homepage or promotional placements.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              form="new-banner-form"
              className="rounded-full bg-black px-5 text-white hover:bg-black/90"
              disabled={isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {getSubmitLabel()}
            </Button>
          </div>
        </div>
      </div>

      <form
        id="new-banner-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-6">
          <CardShell
            icon={<LayoutTemplate className="h-5 w-5 text-black" />}
            title="Banner Information"
            subtitle="Core content, placement, and campaign settings."
          >
            <div className="space-y-5">
              <Field
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Back to School Deals"
                required
              />

              <Field
                label="Subtitle"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="e.g. Shop top essentials and save more this week"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="CTA Text"
                  name="ctaText"
                  value={form.ctaText}
                  onChange={handleChange}
                  placeholder="e.g. Shop Now"
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
                  options={placementOptions}
                />
                <SelectField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={statusOptions}
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
                  label="Schedule Label"
                  name="schedule"
                  value={form.schedule}
                  onChange={handleChange}
                  placeholder="e.g. Apr 20, 2026"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Start Date & Time"
                  name="startsAt"
                  value={form.startsAt}
                  onChange={handleChange}
                  type="datetime-local"
                />
                <Field
                  label="End Date & Time"
                  name="endsAt"
                  value={form.endsAt}
                  onChange={handleChange}
                  type="datetime-local"
                />
              </div>
            </div>
          </CardShell>

          <CardShell
            title="Banner Media"
            subtitle="Add a visual for the banner."
          >
            <div className="space-y-5">
              <ImageUploadField
                label="Banner Image"
                value={form.imageUrl}
                folder="banners"
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
                  {getPlacementLabel(form.placement)}
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

                {form.ctaText ? (
                  <div className="pt-2">
                    <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
                      {form.ctaText}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </CardShell>
        </div>
      </form>
    </section>
  );
}

function toIsoFromDatetimeLocal(value: string) {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString();
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
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: { label: string; value: string }[];
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
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}