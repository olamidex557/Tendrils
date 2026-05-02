import { SignIn } from "@clerk/nextjs";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminSignInPage() {
  return (
    <main className="min-h-screen bg-stone-950 px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            <ShieldCheck className="h-4 w-4" />
            Admin Access
          </div>

          <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
            Welcome back to your store control center.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">
            Manage products, orders, customers, banners, payments, and store
            operations securely from one focused dashboard.
          </p>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
            <Feature icon={<LockKeyhole />} label="Secure login" />
            <Feature icon={<Sparkles />} label="Live commerce" />
            <Feature icon={<ShieldCheck />} label="Admin only" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white p-5 shadow-2xl shadow-black/30 sm:p-6">
          <div className="mb-6 text-center">
            <p className="text-sm font-medium text-stone-500">Tendrils Store</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
              Sign in to Admin
            </h2>
          </div>

          <SignIn
            routing="path"
            path="/admin/sign-in"
            fallbackRedirectUrl="/admin"
            signUpUrl="/admin/sign-in"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none border-0 p-0 w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "rounded-2xl border-stone-200 text-stone-700",
                formButtonPrimary:
                  "rounded-full bg-black text-white hover:bg-black/90 text-sm normal-case",
                formFieldInput:
                  "rounded-2xl border-stone-200 focus:border-black focus:ring-black",
                formFieldLabel: "text-stone-700",
                footerAction: "hidden",
                footer: "hidden",
              },
            }}
          />
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
        {icon}
      </div>
      <p className="text-sm font-medium text-white">{label}</p>
    </div>
  );
}