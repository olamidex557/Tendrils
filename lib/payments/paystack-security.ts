import crypto from "crypto";

export function getAllowedPaystackWebhookIps() {
  const raw =
    process.env.PAYSTACK_WEBHOOK_IPS ||
    "52.31.139.75,52.49.173.169,52.214.14.220";

  return raw
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
}

export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is missing.");
  }

  if (!signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  return signature === expected;
}

export function extractClientIpFromHeaders(headers: Headers) {
  const trustProxy = process.env.TRUST_PROXY_HEADERS === "true";

  const candidates: string[] = [];

  if (trustProxy) {
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
      candidates.push(
        ...forwardedFor
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean)
      );
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) {
      candidates.push(realIp.trim());
    }

    const cfConnectingIp = headers.get("cf-connecting-ip");
    if (cfConnectingIp) {
      candidates.push(cfConnectingIp.trim());
    }
  }

  const forwarded = headers.get("forwarded");
  if (forwarded) {
    const match = forwarded.match(/for="?([^;,"]+)"?/i);
    if (match?.[1]) {
      candidates.push(match[1].trim());
    }
  }

  for (const raw of candidates) {
    const normalized = normalizeIp(raw);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function normalizeIp(value: string) {
  if (!value) return null;

  let ip = value.trim();

  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  if (ip.startsWith("[") && ip.endsWith("]")) {
    ip = ip.slice(1, -1);
  }

  return ip || null;
}

export function isAllowedPaystackWebhookIp(ip: string | null) {
  if (!ip) return false;
  return getAllowedPaystackWebhookIps().includes(ip);
}
