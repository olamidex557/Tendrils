"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";

export default function VerifyPaymentPage() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [message, setMessage] = useState("Confirming your payment securely...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference =
      params.get("reference") || params.get("trxref") || params.get("ref");

    if (!reference) {
      router.replace("/payment-failed?reason=missing_reference");
      return;
    }

    let attempts = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function verify(currentReference: string) {
      try {
        attempts += 1;

        const response = await fetch(
          `/api/payments/verify?reference=${encodeURIComponent(currentReference)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (response.ok) {
          if (!cancelled) {
            clearCart();
            router.replace(
              `/success?reference=${encodeURIComponent(currentReference)}`
            );
          }
          return;
        }

        const data = await response.json().catch(() => null);

        if (attempts >= 6) {
          const reason = encodeURIComponent(
            data?.error || "payment_confirmation_failed"
          );
          router.replace(
            `/payment-failed?reference=${encodeURIComponent(
              currentReference
            )}&reason=${reason}`
          );
          return;
        }

        setMessage("Still waiting for payment confirmation from the payment gateway...");

        timeoutId = setTimeout(() => {
          void verify(currentReference);
        }, 2500);
      } catch {
        router.replace(
          `/payment-failed?reference=${encodeURIComponent(
            currentReference
          )}&reason=verification_error`
        );
      }
    }

    void verify(reference);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, clearCart]);

  return (
    <main className="min-h-[100svh] bg-stone-50 px-4 py-10 md:px-6">
      <div className="mx-auto flex min-h-[80svh] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.045),transparent_35%)]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-600">
                <ShieldCheck className="h-4 w-4" />
                Secure Verification
              </div>

              <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
                <Loader2 className="h-10 w-10 animate-spin text-black" />
              </div>

              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-black md:text-5xl">
                Verifying your payment
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                We are confirming your transaction with our payment provider and updating your order in real time. Please keep this page open for a few seconds.
              </p>

              <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-medium text-black">Current status</p>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {message}
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-200">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="h-full w-1/3 rounded-full bg-black"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="space-y-6"
          >
            <InfoCard
              icon={<CreditCard className="h-5 w-5 text-black" />}
              title="Payment confirmation"
              description="Your payment is being checked against our records and Paystack confirmation flow."
            />

            <InfoCard
              icon={<ShieldCheck className="h-5 w-5 text-black" />}
              title="Secure processing"
              description="Order and payment status are updated only after server-side confirmation succeeds."
            />

            <InfoCard
              icon={<Sparkles className="h-5 w-5 text-black" />}
              title="Almost done"
              description="Once confirmed, your cart is cleared and you will be taken automatically to your success page."
            />
          </motion.aside>
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
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
        {icon}
      </div>
      <h2 className="mt-5 text-xl font-semibold text-black">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-stone-600">{description}</p>
    </motion.div>
  );
}