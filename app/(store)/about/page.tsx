import Link from "next/link";
import type { ReactNode } from "react";
import {
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStorefrontRuntimeSettings } from "@/lib/db/queries/storefront-settings";

export async function generateMetadata() {
  const settings = await getStorefrontRuntimeSettings();

  return {
    title: `About Us | ${settings.storeName}`,
    description: `Learn more about ${settings.storeName}, our product selection, and our shopping experience.`,
  };
}

export default async function AboutPage() {
  const settings = await getStorefrontRuntimeSettings();

  return (
    <main className="bg-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-600">
            <Sparkles className="h-4 w-4" />
            About Us
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-black md:text-6xl">
            Everyday essentials, selected with care.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600">
            {settings.storeName} brings together practical, stylish, and
            reliable products across beauty, fashion, home, lifestyle, and daily
            shopping needs. Every category is built around value, convenience,
            and a smoother way to buy the things customers reach for often.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-black px-6 text-white hover:bg-black/90"
            >
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop products
              </Link>
            </Button>

            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FeaturePanel
            icon={<PackageCheck className="h-5 w-5" />}
            title="Curated catalog"
            description="Useful products organized across clear, shoppable categories."
          />
          <FeaturePanel
            icon={<Truck className="h-5 w-5" />}
            title="Simple delivery flow"
            description="Checkout, payment, and order tracking are built for clarity."
          />
          <FeaturePanel
            icon={<HeartHandshake className="h-5 w-5" />}
            title="Customer focused"
            description="Support details stay easy to find before and after checkout."
          />
          <FeaturePanel
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Clear policies"
            description="Purchase terms are shown plainly so customers know what to expect."
          />
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-3">
          <ValueBlock
            label="01"
            title="We choose useful products"
            text="The store focuses on items that fit real routines, from wardrobe refreshes to home and lifestyle essentials."
          />
          <ValueBlock
            label="02"
            title="We keep shopping direct"
            text="Product browsing, checkout, payment, and order tracking are designed to feel straightforward from start to finish."
          />
          <ValueBlock
            label="03"
            title="We respect customer trust"
            text="Contact information, order status, and purchase guidance stay visible so customers are not left guessing."
          />
        </div>
      </section>
    </main>
  );
}

function FeaturePanel({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-semibold text-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </div>
  );
}

function ValueBlock({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
        {label}
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-black">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-stone-600">{text}</p>
    </div>
  );
}
