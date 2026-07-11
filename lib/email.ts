import { ADMIN_EMAILS } from "./supabase/config";
import { formatNaira } from "./products";

const KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.RESEND_FROM || "Ruaby Fresh <onboarding@resend.dev>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ruabyfresh.vercel.app";

type OrderEmail = {
  id?: string;
  reference: string;
  total: number;
  bulk?: boolean;
  customer?: { name?: string; phone?: string; type?: string; address?: string; note?: string };
  lines: { name: string; qty: number; price: number }[];
  hasReceipt?: boolean;
};

export type EmailStatus = "sent" | "skipped" | "failed";

/**
 * Emails the admin(s) about a new order via Resend. No-op unless RESEND_API_KEY
 * and ADMIN_EMAILS are set. Never throws — returns a coarse status ("sent" /
 * "skipped" / "failed"); detailed errors are logged to the server only (so no
 * sensitive addresses leak through the public API response).
 */
export async function sendOrderEmail(order: OrderEmail): Promise<EmailStatus> {
  if (!KEY || ADMIN_EMAILS.length === 0) return "skipped";

  const c = order.customer ?? {};
  const items = order.lines
    .map(
      (l) =>
        `<tr><td style="padding:4px 0">${l.qty} × ${l.name}</td><td style="padding:4px 0;text-align:right">${formatNaira(
          l.price * l.qty
        )}</td></tr>`
    )
    .join("");
  const fulfilment =
    c.type === "delivery" ? `Delivery — ${c.address || "address to follow"}` : "Pickup";
  const link = order.id ? `${SITE}/admin/orders/${order.id}` : `${SITE}/admin/orders`;

  const html = `
  <div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:auto;color:#1b2a1e">
    <h2 style="color:#1f5e2a;margin:0 0 4px">New booking · ${order.reference}</h2>
    <p style="color:#6b7280;margin:0 0 16px">${formatNaira(order.total)}${order.bulk ? " (bulk)" : ""}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${items}
      <tr><td style="padding:8px 0 0;border-top:1px solid #e5e7eb;font-weight:600">Total</td>
      <td style="padding:8px 0 0;border-top:1px solid #e5e7eb;text-align:right;font-weight:600">${formatNaira(
        order.total
      )}</td></tr>
    </table>
    <p style="font-size:14px;line-height:1.6;margin:16px 0">
      <b>${c.name || "—"}</b><br>${c.phone || "—"}<br>${fulfilment}
      ${c.note ? `<br><i>${c.note}</i>` : ""}
    </p>
    <p style="font-size:14px;margin:0 0 16px">Receipt: ${order.hasReceipt ? "attached ✓" : "not uploaded"}</p>
    <a href="${link}" style="display:inline-block;background:#1f5e2a;color:#fff;text-decoration:none;padding:10px 20px;border-radius:999px;font-weight:600">
      Open in admin →
    </a>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: ADMIN_EMAILS,
        subject: `New order ${order.reference} · ${formatNaira(order.total)}`,
        html,
      }),
    });
    if (res.ok) return "sent";
    console.error("[ruaby-email] Resend", res.status, await res.text().catch(() => ""));
    return "failed";
  } catch (e) {
    console.error("[ruaby-email]", e);
    return "failed";
  }
}
