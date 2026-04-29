import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Payment initialization is handled by the checkout action.",
    },
    { status: 410 }
  );
}