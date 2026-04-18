import { Settings, Store, Wrench } from "lucide-react";

type StorefrontGateProps = {
  mode: "maintenance" | "offline";
  storeName: string;
  supportEmail?: string | null;
};

export default function StorefrontGate({
  mode,
  storeName,
  supportEmail,
}: StorefrontGateProps) {
  const isMaintenance = mode === "maintenance";

  return (
    <main className="min-h-[100svh] bg-stone-50 px-4 py-10 md:px-6">
      <div className="mx-auto flex min-h-[80svh] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
            {isMaintenance ? (
              <Wrench className="h-9 w-9 text-black" />
            ) : (
              <Store className="h-9 w-9 text-black" />
            )}
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-stone-500">
            {storeName}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black md:text-5xl">
            {isMaintenance ? "We’ll be back soon" : "Storefront currently offline"}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
            {isMaintenance
              ? "We’re making improvements behind the scenes to give you a better shopping experience. Please check back shortly."
              : "The storefront is temporarily unavailable right now. Please return later when shopping access has been restored."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<Settings className="h-5 w-5 text-black" />}
              title={isMaintenance ? "Scheduled updates" : "Temporary pause"}
              description={
                isMaintenance
                  ? "Products, categories, and checkout are temporarily hidden while updates are being applied."
                  : "Browsing and ordering are currently paused from the admin control center."
              }
            />
            <InfoCard
              icon={<Store className="h-5 w-5 text-black" />}
              title="Need help?"
              description={
                supportEmail
                  ? `Contact support at ${supportEmail}`
                  : "Support contact details will be available soon."
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5 text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </div>
  );
}
