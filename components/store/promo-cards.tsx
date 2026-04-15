import { Button } from "@/components/ui/button";

const promos = [
  {
    title: "Back to School",
    subtitle: "Grab school supplies at unbeatable prices.",
    bg: "bg-yellow-300",
    button: "Claim Discount",
  },
  {
    title: "20% OFF Fashion",
    subtitle: "Fresh styles for less this week.",
    bg: "bg-white",
    button: "Shop Fashion",
  },
  {
    title: "Weekend Electronics",
    subtitle: "Top gadgets and devices on special offer.",
    bg: "bg-stone-300",
    button: "View Deals",
  },
  {
    title: "New Arrivals",
    subtitle: "Explore the latest products in store.",
    bg: "bg-stone-100",
    button: "Shop New",
  },
];

export default function PromoCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {promos.map((promo) => (
        <div
          key={promo.title}
          className={`rounded-2xl p-5 shadow-sm ring-1 ring-black/5 ${promo.bg}`}
        >
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold leading-tight text-black">
              {promo.title}
            </h3>
            <p className="text-sm text-black/70">{promo.subtitle}</p>
            <Button
              size="sm"
              className="rounded-full bg-black text-white hover:bg-black/90"
            >
              {promo.button}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}