"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, LayoutTemplate, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: "BNR-001",
    title: "Back to School Deals",
    placement: "Homepage Hero",
    status: "Active",
    priority: 1,
    schedule: "Now live",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "BNR-002",
    title: "Weekend Electronics Sale",
    placement: "Promo Strip",
    status: "Scheduled",
    priority: 2,
    schedule: "Starts Apr 20",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "BNR-003",
    title: "Fashion Picks",
    placement: "Homepage Secondary",
    status: "Draft",
    priority: 3,
    schedule: "Not scheduled",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
];

export default function BannersManagementTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Banners" value="9" subtitle="Across all placements" />
        <SummaryCard title="Active" value="4" subtitle="Currently visible" />
        <SummaryCard title="Scheduled" value="2" subtitle="Upcoming campaigns" />
        <SummaryCard title="Drafts" value="3" subtitle="Needs publishing" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm"
          >
            <div className="relative h-56 bg-stone-100">
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-4 top-4 flex gap-2">
                <StatusPill status={banner.status} />
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">
                  Priority {banner.priority}
                </span>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  {banner.id}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-black">
                  {banner.title}
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetaCard
                  icon={<LayoutTemplate className="h-4 w-4 text-stone-500" />}
                  label="Placement"
                  value={banner.placement}
                />
                <MetaCard
                  icon={<CalendarClock className="h-4 w-4 text-stone-500" />}
                  label="Schedule"
                  value={banner.schedule}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <IconActionButton label="Preview banner">
                  <Eye className="h-4 w-4" />
                </IconActionButton>

                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="rounded-full"
                >
                  <Link href={`/admin/banners/${banner.id}/edit`} aria-label="Edit banner">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                <IconActionButton label="Delete banner" danger>
                  <Trash2 className="h-4 w-4" />
                </IconActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-black">
        {value}
      </h3>
      <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "Active"
      ? "bg-green-100 text-green-700"
      : status === "Scheduled"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      </div>
      <p className="mt-2 text-sm font-medium text-black">{value}</p>
    </div>
  );
}

function IconActionButton({
  children,
  label,
  danger = false,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      className={`rounded-full ${danger ? "text-red-600 hover:text-red-700" : "text-stone-700"}`}
    >
      {children}
    </Button>
  );
}