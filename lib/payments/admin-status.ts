const ABANDONED_PAYMENT_AFTER_MS = 30 * 60 * 1000;

export function isStalePendingPayment(status: string, createdAt?: string | null) {
  if (status !== "pending" || !createdAt) return false;

  const createdTime = new Date(createdAt).getTime();
  if (!Number.isFinite(createdTime)) return false;

  return Date.now() - createdTime >= ABANDONED_PAYMENT_AFTER_MS;
}

export function getAdminPaymentStatusLabel(
  status: string,
  createdAt?: string | null
) {
  if (isStalePendingPayment(status, createdAt)) return "Payment abandoned";
  return status.replaceAll("_", " ");
}

export function getAdminPaymentStatusTone(
  status: string,
  createdAt?: string | null
) {
  if (isStalePendingPayment(status, createdAt)) return "failed";
  return status;
}
