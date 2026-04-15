import AnalyticsToolbar from "@/components/admin/analytics-toolbar";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";

export default function AdminAnalyticsPage() {
  return (
    <section className="space-y-6">
      <AnalyticsToolbar />
      <AnalyticsDashboard />
    </section>
  );
}
