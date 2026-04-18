import { NextResponse } from "next/server";
import { trackOrderByNumberAndEmail } from "@/lib/db/queries/order-tracking";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderNumber = String(body?.orderNumber ?? "").trim();
    const email = String(body?.email ?? "").trim();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const order = await trackOrderByNumberAndEmail({ orderNumber, email });

    if (!order) {
      return NextResponse.json(
        { error: "No order found matching that order number and email." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected tracking error.",
      },
      { status: 500 }
    );
  }
}
