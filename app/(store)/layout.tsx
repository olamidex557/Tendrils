import type { ReactNode } from "react";
import Navbar from "@/components/store/navbar";
import Footer from "@/components/store/footer";
import StorefrontCategoryStrip from "@/components/store/storefront-category-strip";
import StorefrontGate from "@/components/store/storefront-gate";
import { getStorefrontRuntimeSettings } from "@/lib/db/queries/storefront-settings";

export default async function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getStorefrontRuntimeSettings();

  if (settings.maintenanceMode) {
    return (
      <StorefrontGate
        mode="maintenance"
        storeName={settings.storeName}
        supportEmail={settings.supportEmail}
      />
    );
  }

  if (!settings.storefrontLive) {
    return (
      <StorefrontGate
        mode="offline"
        storeName={settings.storeName}
        supportEmail={settings.supportEmail}
      />
    );
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
