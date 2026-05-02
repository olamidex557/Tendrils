import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, MessageCircle, PackageSearch, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStorefrontRuntimeSettings } from "@/lib/db/queries/storefront-settings";

export async function generateMetadata() {
  const settings = await getStorefrontRuntimeSettings();

  return {
    title: `Contact Us | ${settings.storeName}`,
    description: `Contact ${settings.storeName} for product, payment, delivery, and order support.`,
  };
}

export default async function ContactPage() {
  const settings = await getStorefrontRuntimeSettings();
  const email =
    settings.supportEmail || settings.storeEmail || "support@ajikeplus.com";
  const phone = settings.storePhone || "+234 703 904 1074";
  const telHref = phone.replace(/[^\d+]/g, "");

  return (
    <main className="bg-stone-50">
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-600 ring-1 ring-stone-200">
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-black md:text-6xl">
            We are here to help.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
            Reach out for product questions, payment assistance, delivery
            updates, or order support. For an existing purchase, include your
            order number so support can check it faster.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-black">
              Contact details
            </h2>

            <div className="mt-6 space-y-4">
              <ContactMethod
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={email}
                href={`mailto:${email}`}
              />
              <ContactMethod
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={phone}
                href={`tel:${telHref}`}
              />
              <ContactMethod
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value="Nigeria"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-black px-6 text-white hover:bg-black/90"
              >
                <a href={`mailto:${email}`}>Send email</a>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/order-tracking">
                  <PackageSearch className="mr-2 h-4 w-4" />
                  Track order
                </Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <SupportBlock
              title="Product questions"
              text="Ask about availability, categories, pricing, and product details before placing an order."
            />
            <SupportBlock
              title="Payment support"
              text="Share your payment reference if a transaction needs to be checked."
            />
            <SupportBlock
              title="Delivery updates"
              text="Use your order number to request the latest fulfillment or delivery status."
            />
            <SupportBlock
              title="Order policy"
              text="Completed purchases are not eligible for refunds or exchanges."
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function ContactMethod({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-black">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
          {label}
        </span>
        <span className="mt-1 block break-all text-sm font-medium text-black">
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-4 rounded-lg border border-stone-200 p-4 transition hover:border-black/30"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-stone-200 p-4">
      {content}
    </div>
  );
}

function SupportBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-black">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
    </div>
  );
}
