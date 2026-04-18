import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "No reference" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await res.json();

  if (!data.status || data.data.status !== "success") {
    return NextResponse.json({ error: "Payment failed" }, { status: 400 });
  }

  const amount = data.data.amount / 100;

  // Save payment
  await supabaseAdmin.from("payments").insert({
    reference,
    amount,
    status: "success",
  });

  // Update order
  await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "paid",
      status: "processing",
    })
    .eq("order_number", reference);

  return NextResponse.json({ success: true });
}
