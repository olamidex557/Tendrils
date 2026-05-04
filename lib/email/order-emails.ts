import { sendEmail } from "@/lib/email/send-email";

type OrderEmailItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  address: string;
  fulfillmentMethod?: "delivery" | "pickup";
  items: OrderEmailItem[];
};

function money(value: number) {
  return `₦${Number(value).toLocaleString()}`;
}

function escapeHtml(value: string) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function orderItemsRows(items: OrderEmailItem[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 12px;border-bottom:1px solid #eeeeee;color:#111111;">
            ${escapeHtml(item.product_name)}
          </td>
          <td align="center" style="padding:14px 12px;border-bottom:1px solid #eeeeee;color:#555555;">
            ${item.quantity}
          </td>
          <td align="right" style="padding:14px 12px;border-bottom:1px solid #eeeeee;color:#555555;">
            ${money(item.unit_price)}
          </td>
          <td align="right" style="padding:14px 12px;border-bottom:1px solid #eeeeee;font-weight:700;color:#111111;">
            ${money(item.line_total)}
          </td>
        </tr>
      `
    )
    .join("");
}

function baseEmailLayout(content: string) {
  return `
    <div style="margin:0;padding:0;background:#f6f4ef;font-family:Arial,Helvetica,sans-serif;color:#111111;">
      <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #eeeeee;">
          <div style="padding:28px;background:#111111;color:#ffffff;">
            <h1 style="margin:0;font-size:26px;letter-spacing:-0.03em;">Tendrils</h1>
            <p style="margin:8px 0 0;color:#d6d3cc;font-size:14px;">Beautiful essentials, delivered.</p>
          </div>

          <div style="padding:28px;">
            ${content}
          </div>

          <div style="padding:20px 28px;background:#fafafa;border-top:1px solid #eeeeee;">
            <p style="margin:0;color:#777777;font-size:12px;line-height:20px;">
              This email was sent by Tendrils. Please keep your order number for tracking and support.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendCustomerOrderConfirmationEmail(order: OrderEmailData) {
  const isPickup = order.fulfillmentMethod === "pickup";

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: baseEmailLayout(`
      <h2 style="margin:0;font-size:24px;letter-spacing:-0.03em;color:#111111;">
        Order confirmed 🎉
      </h2>

      <p style="margin:14px 0 0;font-size:15px;line-height:26px;color:#555555;">
        Hi ${escapeHtml(order.customerName)}, your payment was successful and your order has been received.
      </p>

      <div style="margin:24px 0;padding:18px;border-radius:18px;background:#f8f6f1;border:1px solid #eeeeee;">
        <p style="margin:0 0 8px;font-size:14px;color:#555555;">
          <strong style="color:#111111;">Order Number:</strong> ${escapeHtml(order.orderNumber)}
        </p>
        <p style="margin:0;font-size:14px;line-height:22px;color:#555555;">
          <strong style="color:#111111;">${isPickup ? "Fulfillment" : "Delivery Address"}:</strong><br/>
          ${escapeHtml(isPickup ? "Pickup" : order.address)}
        </p>
      </div>

      <table width="100%" style="border-collapse:collapse;margin-top:16px;">
        <thead>
          <tr>
            <th align="left" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Item</th>
            <th align="center" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Qty</th>
            <th align="right" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Unit</th>
            <th align="right" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsRows(order.items)}
        </tbody>
      </table>

      <div style="margin-top:22px;text-align:right;">
        <p style="margin:0;color:#555555;font-size:14px;">Order Total</p>
        <p style="margin:6px 0 0;font-size:28px;font-weight:800;color:#111111;">
          ${money(order.total)}
        </p>
      </div>

      <p style="margin:24px 0 0;font-size:14px;line-height:24px;color:#555555;">
        We’ll notify you once your order is fulfilled.
      </p>
    `),
  });
}

export async function sendAdminNewOrderEmail(order: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const isPickup = order.fulfillmentMethod === "pickup";

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL is missing. Admin email skipped.");
    return null;
  }

  return sendEmail({
    to: adminEmail,
    subject: `New Order Received — ${order.orderNumber}`,
    html: baseEmailLayout(`
      <h2 style="margin:0;font-size:24px;letter-spacing:-0.03em;color:#111111;">
        New order received
      </h2>

      <div style="margin:24px 0;padding:18px;border-radius:18px;background:#f8f6f1;border:1px solid #eeeeee;">
        <p style="margin:0 0 8px;font-size:14px;color:#555555;">
          <strong style="color:#111111;">Order:</strong> ${escapeHtml(order.orderNumber)}
        </p>
        <p style="margin:0 0 8px;font-size:14px;color:#555555;">
          <strong style="color:#111111;">Customer:</strong> ${escapeHtml(order.customerName)}
        </p>
        <p style="margin:0 0 8px;font-size:14px;color:#555555;">
          <strong style="color:#111111;">Email:</strong> ${escapeHtml(order.customerEmail)}
        </p>
        <p style="margin:0;font-size:14px;line-height:22px;color:#555555;">
          <strong style="color:#111111;">${isPickup ? "Fulfillment" : "Address"}:</strong><br/>
          ${escapeHtml(isPickup ? "Pickup" : order.address)}
        </p>
      </div>

      <table width="100%" style="border-collapse:collapse;margin-top:16px;">
        <thead>
          <tr>
            <th align="left" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Item</th>
            <th align="center" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Qty</th>
            <th align="right" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Unit</th>
            <th align="right" style="padding:12px;background:#111111;color:#ffffff;font-size:13px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsRows(order.items)}
        </tbody>
      </table>

      <div style="margin-top:22px;text-align:right;">
        <p style="margin:0;color:#555555;font-size:14px;">Order Total</p>
        <p style="margin:6px 0 0;font-size:28px;font-weight:800;color:#111111;">
          ${money(order.total)}
        </p>
      </div>
    `),
  });
}

export async function sendOrderDeliveredEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
}) {
  return sendEmail({
    to: order.customerEmail,
    subject: `Your Order Has Been Delivered — ${order.orderNumber}`,
    html: baseEmailLayout(`
      <h2 style="margin:0;font-size:24px;letter-spacing:-0.03em;color:#111111;">
        Order delivered 🎉
      </h2>

      <p style="margin:14px 0 0;font-size:15px;line-height:26px;color:#555555;">
        Hi ${escapeHtml(order.customerName)}, your order <strong>${escapeHtml(
      order.orderNumber
    )}</strong> has been marked as delivered.
      </p>

      <p style="margin:18px 0 0;font-size:14px;line-height:24px;color:#555555;">
        Thank you for shopping with Tendrils. We hope you love your purchase.
      </p>

      <div style="margin-top:26px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "#"}"
          style="display:inline-block;background:#111111;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700;">
          Continue Shopping
        </a>
      </div>
    `),
  });
}
