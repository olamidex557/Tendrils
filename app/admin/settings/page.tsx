import SettingsClientPage from "@/components/admin/settings-client-page";
import { getAdminStoreSettings } from "@/lib/db/queries/admin-settings";
import { getShippingZones } from "@/lib/db/queries/shipping-settings";

export default async function AdminSettingsPage() {
  const [settings, shippingZones] = await Promise.all([
    getAdminStoreSettings(),
    getShippingZones(),
  ]);

  return (
    <SettingsClientPage
      initialSettings={settings}
      initialShippingZones={shippingZones}
    />
  );
}