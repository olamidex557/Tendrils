import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStoreRuntimeState } from "@/lib/storefront/runtime";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference." },
        { status: 400 }
      );
    }

    const settings = await getStoreRuntimeState();

    if (settings.maintenanceMode) {
      return NextResponse.json(
        { error: "Payment verification is temporarily paused during maintenance." },
        { status: 423 }
      );
    }

    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id, status")
      .eq("reference", reference)
      .maybeSingle();

    if (existingPayment?.status === "success") {
      return NextResponse.json({ success: true, source: "database" });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData.status) {
      return NextResponse.json(
        { error: verifyData?.message || "Unable to verify payment." },
        { status: 400 }
      );
    }

    const transactionStatus = verifyData?.data?.status;

    if (transactionStatus !== "success") {
      return NextResponse.json(
        {
          error: `Payment is not successful yet. Current status: ${transactionStatus || "unknown"}.`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, source: "verify-api" });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected verification error.",
      },
      { status: 500 }
    );
  }
}
