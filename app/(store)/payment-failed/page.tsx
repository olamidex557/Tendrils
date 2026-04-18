"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  LifeBuoy,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const reference = params?.get("reference") || "";
  const reason = params?.get("reason") || "Payment confirmation failed.";

  return (
    <main className="min-h-[100svh] bg-stone-50 px-4 py-10 md:px-6">
      <div className="mx-auto flex min-h-[80svh] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.section
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_35%)]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Payment Not Confirmed
              </div>

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100"
              >
                <AlertTriangle className="h-10 w-10 text-red-700" />
              </motion.div>

              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-black md:text-5xl">
                Payment confirmation failed
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                We could not fully confirm this payment yet. This may happen if
                verification took too long, the transaction is still processing,
                or the confirmation flow was interrupted.
              </p>

              <div className="mt-8 rounded-[1.5rem] border border-red-200 bg-red-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-red-600">
                  Reason
                </p>
                <p className="mt-2 text-sm font-medium text-red-700">
                  {decodeURIComponent(reason)}
                </p>
              </div>

              {reference ? (
                <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Payment Reference
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-black">
                    {reference}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-black px-6 text-white hover:bg-black/90"
                >
                  <Link href="/checkout">
                    Try Again
                    <RefreshCcw className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link href="/cart">
                    Back to Cart
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
              title="What may have happened"
              description="The payment may still be pending, the callback may have been interrupted, or verification may not have completed in time."
            />

            <InfoCard
              icon={<RefreshCcw className="h-5 w-5 text-black" />}
              title="What to do next"
              description="You can retry checkout, wait a little and track the order, or confirm whether the payment was actually debited before paying again."
            />

            <InfoCard
              icon={<LifeBuoy className="h-5 w-5 text-black" />}
              title="Need support?"
              description="Use your payment reference when contacting support so the transaction can be checked quickly."
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