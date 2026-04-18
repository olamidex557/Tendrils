"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Lock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { createCheckoutSession } from "@/lib/actions/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
  }, [cartItems]);

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createCheckoutSession({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        });

        if (!result?.checkoutUrl) {
          throw new Error("Unable to start payment.");
        }

        window.location.href = result.checkoutUrl;
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Checkout failed."
        );
      }
    });
  }

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Add some products before proceeding to checkout.
          </p>

          <Button asChild className="mt-6 rounded-full bg-black px-6 text-white hover:bg-black/90">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/cart" className="inline-flex items-center gap-2 transition hover:text-black">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-black">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Complete your shipping details and continue to secure payment.
        </p>
      </div>

      <form
        onSubmit={handleCheckout}
        className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <section className="space-y-6">
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
                <Truck className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  Shipping Information
                </h2>
                <p className="text-sm text-stone-500">
                  Enter customer and delivery details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Olamide Ajike"
                required
              />

              <Field
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08012345678"
                required
              />

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter full delivery address"
                  rows={5}
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none 
transition focus:border-black/30"
                />
              </div>
            </div>
          </div>

          {message ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
              {message}
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
                <CreditCard className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  Order Summary
                </h2>
                <p className="text-sm text-stone-500">
                  Review your cart before payment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-black">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-black">
                    ₦{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-stone-200 pt-6">
              <SummaryRow
                label="Subtotal"
                value={`₦${subtotal.toLocaleString()}`}
              />
              <SummaryRow
                label="Shipping"
                value={shippingFee === 0 ? "Free" : `₦${shippingFee.toLocaleString()}`}
              />
              <SummaryRow
                label="Total"
                value={`₦${total.toLocaleString()}`}
                bold
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="mt-6 h-12 w-full rounded-full bg-black text-white hover:bg-black/90"
            >
              {isPending ? "Redirecting..." : "Place Order"}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
              <Lock className="h-4 w-4" />
              Secure checkout powered by Paystack
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-black">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition 
focus:border-black/30"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? "font-semibold text-black" : "text-stone-600"}`}>
        {label}
      </span>
      <span className={`text-sm ${bold ? "font-semibold text-black" : "text-stone-700"}`}>
        {value}
      </span>
    </div>
  );
}
