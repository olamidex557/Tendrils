import SettingsClientPage from "@/components/admin/settings-client-page";
import { getAdminStoreSettings } from "@/lib/db/queries/admin-settings";

export default async function AdminSettingsPage() {
  const settings = await getAdminStoreSettings();

  return <SettingsClientPage initialSettings={settings} />;
}