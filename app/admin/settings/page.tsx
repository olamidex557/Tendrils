"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Settings,
  Store,
  Bell,
  Truck,
  Globe,
  ShieldCheck,
  Save,
  RotateCcw,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultSettings = {
  storeName: "Tendrils",
  storeEmail: "info@tendrils.com",
  storePhone: "+234 705 224 3768",
  supportEmail: "support@tendrils.com",
  currency: "NGN",
  locale: "en-NG",
  timezone: "Africa/Lagos",
  shippingFee: "5000",
  freeShippingThreshold: "100000",
  orderEmailNotifications: true,
  paymentEmailNotifications: true,
  marketingEmails: false,
  storefrontLive: true,
  maintenanceMode: false,
};

export default function AdminSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "idle">(
    "idle"
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const [form, setForm] = useState(defaultSettings);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const hasChanges = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(defaultSettings);
  }, [form]);

  const storefrontStatus = useMemo(() => {
    if (form.maintenanceMode) {
      return {
        label: "Maintenance Mode",
        description: "Public access is temporarily limited while updates are being made.",
        tone: "bg-amber-100 text-amber-700",
      };
    }

    if (form.storefrontLive) {
      return {
        label: "Storefront Live",
        description: "Customers can browse products and place orders normally.",
        tone: "bg-green-100 text-green-700",
      };
    }

    return {
      label: "Storefront Offline",
      description: "Public storefront access is currently disabled.",
      tone: "bg-red-100 text-red-700",
    };
  }, [form.maintenanceMode, form.storefrontLive]);

  function handleReset() {
    setForm(defaultSettings);
    setMessage("Settings reset to current defaults.");
    setMessageType("success");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setMessageType("idle");

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 900));

        console.log("Settings payload:", form);

        setLastSavedAt(new Date().toLocaleString());
        setMessage("Settings saved successfully. Backend sync is ready for the next step.");
        setMessageType("success");
      } catch {
        setMessage("Failed to save settings.");
        setMessageType("error");
      }
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-stone-500">Store configuration</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Settings
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Manage brand identity, operations, notifications, shipping, and storefront controls.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-5"
              onClick={handleReset}
              disabled={isPending}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Changes
            </Button>

            <Button
              type="submit"
              form="admin-settings-form"
              className="rounded-full bg-black px-5 text-white hover:bg-black/90"
              disabled={isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>

      <form
        id="admin-settings-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-6">
          <CardShell
            icon={<Store className="h-5 w-5 text-black" />}
            title="Store Profile"
            subtitle="Basic brand and contact information."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Store Name"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
              />
              <Field
                label="Store Email"
                name="storeEmail"
                value={form.storeEmail}
                onChange={handleChange}
                type="email"
              />
              <Field
                label="Store Phone"
                name="storePhone"
                value={form.storePhone}
                onChange={handleChange}
              />
              <Field
                label="Support Email"
                name="supportEmail"
                value={form.supportEmail}
                onChange={handleChange}
                type="email"
              />
            </div>
          </CardShell>

          <CardShell
            icon={<Globe className="h-5 w-5 text-black" />}
            title="Regional Settings"
            subtitle="Set the primary currency, locale, and timezone."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                options={["NGN", "USD", "GBP", "EUR"]}
              />
              <SelectField
                label="Locale"
                name="locale"
                value={form.locale}
                onChange={handleChange}
                options={["en-NG", "en-US", "en-GB"]}
              />
              <SelectField
                label="Timezone"
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                options={[
                  "Africa/Lagos",
                  "UTC",
                  "Europe/London",
                  "America/New_York",
                ]}
              />
            </div>
          </CardShell>

          <CardShell
            icon={<Truck className="h-5 w-5 text-black" />}
            title="Shipping Settings"
            subtitle="Configure base shipping fees and free shipping rules."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Default Shipping Fee"
                name="shippingFee"
                value={form.shippingFee}
                onChange={handleChange}
                type="number"
              />
              <Field
                label="Free Shipping Threshold"
                name="freeShippingThreshold"
                value={form.freeShippingThreshold}
                onChange={handleChange}
                type="number"
              />
            </div>
          </CardShell>

          {message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-stone-200 bg-white text-stone-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {messageType === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : messageType === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : null}
                <span>{message}</span>
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-4 z-10 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-lg">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  Ready to save your store settings?
                </p>
                <p className="text-sm text-stone-500">
                  Review changes before applying them to the storefront.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={handleReset}
                  disabled={isPending}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-black px-5 text-white hover:bg-black/90"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CardShell
            icon={<Bell className="h-5 w-5 text-black" />}
            title="Notifications"
            subtitle="Choose which store alerts you want enabled."
          >
            <div className="space-y-4">
              <ToggleRow
                label="Order Email Notifications"
                description="Get alerts when new orders are placed."
                name="orderEmailNotifications"
                checked={form.orderEmailNotifications}
                onChange={handleChange}
              />
              <ToggleRow
                label="Payment Email Notifications"
                description="Get alerts for payment success and failures."
                name="paymentEmailNotifications"
                checked={form.paymentEmailNotifications}
                onChange={handleChange}
              />
              <ToggleRow
                label="Marketing Emails"
                description="Receive campaign and promotional reminders."
                name="marketingEmails"
                checked={form.marketingEmails}
                onChange={handleChange}
              />
            </div>
          </CardShell>

          <CardShell
            icon={<ShieldCheck className="h-5 w-5 text-black" />}
            title="Storefront Controls"
            subtitle="Control live status and maintenance mode."
          >
            <div className="space-y-4">
              <ToggleRow
                label="Storefront Live"
                description="Allow customers to browse and place orders."
                name="storefrontLive"
                checked={form.storefrontLive}
                onChange={handleChange}
              />
              <ToggleRow
                label="Maintenance Mode"
                description="Temporarily hide public access while updating the site."
                name="maintenanceMode"
                checked={form.maintenanceMode}
                onChange={handleChange}
              />
            </div>
          </CardShell>

          <CardShell
            icon={<Activity className="h-5 w-5 text-black" />}
            title="Store Health"
            subtitle="Quick operational view of your current setup."
          >
            <div className="space-y-4">
              <div className="rounded-2xl bg-stone-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-black">
                      Storefront Status
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {storefrontStatus.description}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${storefrontStatus.tone}`}
                  >
                    {storefrontStatus.label}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-black">
                      Notification Coverage
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {[
                        form.orderEmailNotifications,
                        form.paymentEmailNotifications,
                        form.marketingEmails,
                      ].filter(Boolean).length}
                      {" "}notification stream(s) enabled
                    </p>
                  </div>

                  <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </CardShell>

          <CardShell
            icon={<Settings className="h-5 w-5 text-black" />}
            title="Settings Summary"
            subtitle="Quick overview of your current configuration."
          >
            <div className="space-y-3">
              <SummaryRow label="Store" value={form.storeName} />
              <SummaryRow label="Currency" value={form.currency} />
              <SummaryRow label="Locale" value={form.locale} />
              <SummaryRow label="Timezone" value={form.timezone} />
              <SummaryRow
                label="Storefront"
                value={form.storefrontLive ? "Live" : "Offline"}
              />
              <SummaryRow
                label="Maintenance"
                value={form.maintenanceMode ? "On" : "Off"}
              />
              <SummaryRow
                label="Shipping Fee"
                value={`₦${Number(form.shippingFee || 0).toLocaleString()}`}
              />
              <SummaryRow
                label="Free Shipping"
                value={`₦${Number(
                  form.freeShippingThreshold || 0
                ).toLocaleString()}`}
              />
            </div>
          </CardShell>

          <CardShell
            icon={<Clock3 className="h-5 w-5 text-black" />}
            title="Save Activity"
            subtitle="Recent settings activity."
          >
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-black">
                {lastSavedAt ? "Last Saved" : "No saved changes yet"}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                {lastSavedAt
                  ? lastSavedAt
                  : "Make changes and save to create your first settings snapshot."}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-stone-200 p-4">
              <p className="text-sm text-stone-500">
                {hasChanges
                  ? "You have unsaved changes."
                  : "Everything is currently in sync with the loaded defaults."}
              </p>
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
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
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

function ToggleRow({
  label,
  description,
  name,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div>
        <p className="text-sm font-medium text-black">{label}</p>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </div>
  );
}