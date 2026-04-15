"use client";

import { useState } from "react";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-8 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <ShieldCheck className="h-7 w-7 text-green-700" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-black">
          Order details captured
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600">
          Your checkout details have been collected successfully. The next step
          is payment initialization. We’ll connect this button to Paystack next.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="rounded-full bg-black px-6 text-white hover:bg-black/90">
            Continue to Payment
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-full px-6"
            onClick={() => {
              clearCart();
            }}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm md:p-8"
    >
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-black">
          Billing Details
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Enter your information to complete your order.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <Field
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Field
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <Field
        label="Address"
        name="address"
        value={form.address}
        onChange={handleChange}
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
        />
        <Field
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black">
          Order Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any delivery instructions?"
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition 
focus:border-black/30"
        />
      </div>

      <div className="rounded-[1.25rem] bg-stone-50 p-5">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-stone-700" />
          <p className="text-sm font-semibold text-black">Delivery</p>
        </div>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Orders are processed after payment confirmation. Delivery timelines
          depend on your location.
        </p>
      </div>

      <div className="rounded-[1.25rem] bg-stone-50 p-5">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-stone-700" />
          <p className="text-sm font-semibold text-black">Payment Method</p>
        </div>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Paystack integration will be used for secure card and transfer
          payments.
        </p>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-full bg-black text-white hover:bg-black/90"
      >
        Continue to Payment
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        required={required}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition 
focus:border-black/30"
      />
    </div>
  );
}
