import { ShieldCheck, Truck, RefreshCcw, PackageCheck } from "lucide-react";

const items = [
  {
    title: "Fast Delivery",
    description: "Quick shipping on orders across supported locations.",
    icon: Truck,
  },
  {
    title: "Secure Payments",
    description: "Safe checkout powered by trusted payment providers.",
    icon: ShieldCheck,
  },
  {
    title: "Quality Products",
    description: "Carefully selected items across every category.",
    icon: PackageCheck,
  },
  {
    title: "Easy Returns",
    description: "Simple return process for eligible orders.",
    icon: RefreshCcw,
  },
];

export default function BrandStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-4 rounded-[2rem] border border-black/5 bg-stone-50 p-5 md:grid-cols-2 lg:grid-cols-4 lg:p-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-black/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-base font-semibold text-black">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}