import OrderTrackingHero from "@/components/store/order-tracking-hero";
import OrderTrackingForm from "@/components/store/order-tracking-form";
import BrandStrip from "@/components/store/brand-strip";

export default function OrderTrackingPage() {
  return (
    <main>
      <OrderTrackingHero />
      <OrderTrackingForm />
      <BrandStrip />
    </main>
  );
}