import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminPaymentDetailsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Link>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
          Payment Details
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Detailed payment view UI can be expanded next.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-600">
          This is the placeholder for a full payment details page.
        </p>
      </div>
    </section>
  );
}
