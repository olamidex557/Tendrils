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
  Sparkles,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { saveStoreSettings } from "@/lib/actions/settings";
import type { AdminStoreSettings } from "@/lib/db/queries/admin-settings";

type Props = {
  initialSettings: AdminStoreSettings;
};

function formatStableDateTime(value: string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function SettingsClientPage({ initialSettings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "idle">(
    "idle"
  );
  const [form, setForm] = useState(initialSettings);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    formatStableDateTime(initialSettings.updatedAt)
  );

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
    return JSON.stringify(form) !== JSON.stringify(initialSettings);
  }, [form, initialSettings]);

  const enabledNotifications = useMemo(() => {
    return [
      form.orderEmailNotifications,
      form.paymentEmailNotifications,
      form.marketingEmails,
    ].filter(Boolean).length;
  }, [
    form.orderEmailNotifications,
    form.paymentEmailNotifications,
    form.marketingEmails,
  ]);

  const storefrontStatus = useMemo(() => {
    if (form.maintenanceMode) {
      return {
        label: "Maintenance Mode",
        description:
          "Public access is temporarily limited while updates are being made.",
        tone: "bg-amber-100 text-amber-700 border-amber-200",
      };
    }

    if (form.storefrontLive) {
      return {
        label: "Storefront Live",
        description:
          "Customers can browse products and place orders normally.",
        tone: "bg-green-100 text-green-700 border-green-200",
      };
    }

    return {
      label: "Storefront Offline",
      description: "Public storefront access is currently disabled.",
      tone: "bg-red-100 text-red-700 border-red-200",
    };
  }, [form.maintenanceMode, form.storefrontLive]);

  function handleReset() {
    setForm(initialSettings);
    setMessage("Settings reset to last saved values.");
    setMessageType("success");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setMessageType("idle");

    startTransition(async () => {
      try {
        await saveStoreSettings({
          id: form.id,
          storeName: form.storeName,
          storeEmail: form.storeEmail,
          storePhone: form.storePhone,
          supportEmail: form.supportEmail,
          currency: form.currency,
          locale: form.locale,
          timezone: form.timezone,
          shippingFee: Number(form.shippingFee || 0),
          freeShippingThreshold: Number(form.freeShippingThreshold || 0),
          orderEmailNotifications: form.orderEmailNotifications,
          paymentEmailNotifications: form.paymentEmailNotifications,
          marketingEmails: form.marketingEmails,
          storefrontLive: form.storefrontLive,
          maintenanceMode: form.maintenanceMode,
        });

        setLastSavedAt(formatStableDateTime(new Date().toISOString()));
        setMessage("Settings saved successfully.");
        setMessageType("success");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to save settings."
        );
        setMessageType("error");
      }
    });
  }

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_35%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-stone-500">Store configuration</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                <Settings className="h-6 w-6 text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-black">
                  Settings
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  Beautiful, lively controls for your storefront operations.
                </p>
              </div>
            </div>
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
      </motion.div>

      <form
        id="admin-settings-form"
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]"
      >
        <div className="space-y-6">
          <AnimatedCard delay={0.02}>
            <CardShell
              icon={<Store className="h-5 w-5 text-black" />}
              title="Store Profile"
              subtitle="Basic brand and contact information."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Store Name" name="storeName" value={form.storeName} onChange={handleChange} />
                <Field label="Store Email" name="storeEmail" value={form.storeEmail} onChange={handleChange} type="email" />
                <Field label="Store Phone" name="storePhone" value={form.storePhone} onChange={handleChange} />
                <Field label="Support Email" name="supportEmail" value={form.supportEmail} onChange={handleChange} type="email" />
              </div>
            </CardShell>
          </AnimatedCard>

          <AnimatedCard delay={0.06}>
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
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
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
          </AnimatedCard>

          {message ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {messageType === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message}</span>
              </div>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="sticky bottom-4 z-10 rounded-[1.5rem] border border-black/5 bg-white/90 p-4 shadow-lg backdrop-blur"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-black">
                  Ready to apply your store settings?
                </p>
                <p className="text-sm text-stone-500">
                  Save changes to keep operations and storefront behavior aligned.
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
          </motion.div>
        </div>

        <div className="space-y-6">
          <AnimatedCard delay={0.04}>
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
          </AnimatedCard>

          <AnimatedCard delay={0.08}>
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
          </AnimatedCard>

          <AnimatedCard delay={0.12}>
            <CardShell
              icon={<Activity className="h-5 w-5 text-black" />}
              title="Store Health"
              subtitle="Quick operational view of your current setup."
            >
              <div className="space-y-4">
                <HoverPanel>
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
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${storefrontStatus.tone}`}
                    >
                      {storefrontStatus.label}
                    </span>
                  </div>
                </HoverPanel>

                <HoverPanel>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-black">
                        Notification Coverage
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {enabledNotifications} stream(s) enabled
                      </p>
                    </div>

                    <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
                      Active
                    </span>
                  </div>
                </HoverPanel>

                <HoverPanel>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-black">
                        Shipping Experience
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        Free shipping starts at ₦
                        {Number(
                          form.freeShippingThreshold || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                      Optimized
                    </span>
                  </div>
                </HoverPanel>
              </div>
            </CardShell>
          </AnimatedCard>

          <AnimatedCard delay={0.16}>
            <CardShell
              icon={<Sparkles className="h-5 w-5 text-black" />}
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
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <CardShell
              icon={<Clock3 className="h-5 w-5 text-black" />}
              title="Save Activity"
              subtitle="Recent settings activity."
            >
              <div className="space-y-4">
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

                <div className="rounded-2xl border border-dashed border-stone-200 p-4">
                  <div className="flex items-center gap-2">
                    {hasChanges ? (
                      <Zap className="h-4 w-4 text-amber-600" />
                    ) : (
                      <BadgeCheck className="h-4 w-4 text-green-600" />
                    )}
                    <p className="text-sm text-stone-500">
                      {hasChanges
                        ? "You have unsaved changes."
                        : "Everything is currently in sync with the loaded defaults."}
                    </p>
                  </div>
                </div>
              </div>
            </CardShell>
          </AnimatedCard>
        </div>
      </form>
    </section>
  );
}

function AnimatedCard({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <motion.div
            whileHover={{ rotate: 6, scale: 1.03 }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100"
          >
            {icon}
          </motion.div>
        ) : null}
        <div>
          <h3 className="text-xl font-semibold text-black">{title}</h3>
          <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

function HoverPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="rounded-2xl bg-stone-50 p-4"
    >
      {children}
    </motion.div>
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
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
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
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
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
    <motion.label
      whileHover={{ y: -1 }}
      className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4"
    >
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
    </motion.label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3"
    >
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </motion.div>
  );
}