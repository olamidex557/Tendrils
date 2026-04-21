"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock3, FileText } from "lucide-react";
import { updateBannerStatus } from "@/lib/actions/banners";
import { Button } from "@/components/ui/button";

type BannerStatus = "active" | "draft" | "scheduled";

type Props = {
  bannerId: string;
  currentStatus: BannerStatus;
};

export default function BannerStatusToggle({
  bannerId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState<BannerStatus>(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(nextStatus: BannerStatus) {
    if (nextStatus === status) return;

    setMessage("");

    startTransition(async () => {
      try {
        await updateBannerStatus(bannerId, nextStatus);
        setStatus(nextStatus);
        setMessage(
          nextStatus === "active"
            ? "Banner activated."
            : nextStatus === "scheduled"
            ? "Banner scheduled."
            : "Banner moved to draft."
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to update banner status."
        );
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={status === "active" ? "default" : "outline"}
          onClick={() => handleStatusChange("active")}
          disabled={isPending}
          className={`rounded-full ${
            status === "active"
              ? "bg-black text-white hover:bg-black/90"
              : ""
          }`}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Activate
        </Button>

        <Button
          type="button"
          size="sm"
          variant={status === "scheduled" ? "default" : "outline"}
          onClick={() => handleStatusChange("scheduled")}
          disabled={isPending}
          className={`rounded-full ${
            status === "scheduled"
              ? "bg-amber-500 text-white hover:bg-amber-500/90"
              : ""
          }`}
        >
          <Clock3 className="mr-2 h-4 w-4" />
          Schedule
        </Button>

        <Button
          type="button"
          size="sm"
          variant={status === "draft" ? "default" : "outline"}
          onClick={() => handleStatusChange("draft")}
          disabled={isPending}
          className={`rounded-full ${
            status === "draft"
              ? "bg-stone-800 text-white hover:bg-stone-800/90"
              : ""
          }`}
        >
          <FileText className="mr-2 h-4 w-4" />
          Draft
        </Button>
      </div>

      {message ? (
        <p className="text-xs text-stone-500">{message}</p>
      ) : null}
    </div>
  );
}