"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your payment...");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");

    if (!ref) {
      setStatus("failed");
      setMessage("Payment reference is missing.");
      return;
    }

    setReference(ref);

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/payments/verify?reference=${encodeURIComponent(ref)}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || "Payment verification failed.");
        }

        clearCart();
        setStatus("success");
        setMessage("Your payment was verified successfully.");
      } catch (error) {
        setStatus("failed");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify payment."
        );
      }
    }

    verifyPayment();
  }, [clearCart]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-sm">
        {status === "verifying" ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
              <Loader2 className="h-7 w-7 animate-spin text-black" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-black">
              Verifying Payment
            </h1>
            <p className="mt-3 text-sm text-stone-600">{message}</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-700" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-black">
              Payment Successful
            </h1>
            <p className="mt-3 text-sm text-stone-600">{message}</p>

            {reference ? (
              <p className="mt-3 text-xs text-stone-500">
                Reference: {reference}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-black px-6 text-white hover:bg-black/90">
                <Link href="/products">Continue Shopping</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/order-tracking">Track Order</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl font-bold text-red-700">!</span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-black">
              Verification Failed
            </h1>
            <p className="mt-3 text-sm text-stone-600">{message}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-black px-6 text-white hover:bg-black/90">
                <Link href="/checkout">Try Again</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/cart">Back to Cart</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
