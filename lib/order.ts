import { BRAND, formatNaira } from "./products";

export type Customer = {
  name: string;
  phone: string;
  type: "delivery" | "pickup";
  address?: string;
  note?: string;
};

export type OrderLine = { name: string; qty: number; price: number };

export type OrderInput = {
  lines: OrderLine[];
  total: number;
  customer: Customer;
  reference: string;
  bulk?: boolean;
};

/** Short human order reference, e.g. RUABY-7F3K9. */
export function orderRef() {
  return "RUABY-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

/**
 * Builds the plain-text order message. No emojis (keeps it clean across all
 * devices) and no bank details (the customer has already paid).
 */
export function buildOrderMessage(
  { lines, total, customer, reference, bulk }: OrderInput,
  receiptUrl?: string | null
) {
  const items = lines
    .map((l) => `• ${l.qty} × ${l.name} — ${formatNaira(l.price * l.qty)}`)
    .join("\n");

  const fulfilment =
    customer.type === "delivery"
      ? `Delivery to: ${customer.address || "(address to follow)"}`
      : "Fulfilment: Pickup";

  return (
    `*Ruaby Fresh — Pre-order ${reference}*\n\n` +
    `${items}\n` +
    `Total: ${formatNaira(total)}${bulk ? " (bulk price)" : ""}\n\n` +
    `Name: ${customer.name}\n` +
    `Phone: ${customer.phone}\n` +
    `${fulfilment}\n` +
    (customer.note ? `Note: ${customer.note}\n` : "") +
    `\n` +
    (receiptUrl
      ? `I've made the transfer.\nPayment receipt: ${receiptUrl}`
      : `I've made the transfer. I'll attach my payment receipt in this chat.`)
  );
}

/** WhatsApp deep link carrying the order message (text only). */
export function whatsappUrl(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Saves the order + receipt to the admin (via /api/order) and returns the
 * parsed response, including `receiptUrl` — a 7-day signed link to the uploaded
 * receipt that we drop into the WhatsApp message so it "comes with" the order.
 */
export async function storeOrder(
  order: OrderInput,
  receipt: File
): Promise<{ ok: boolean; reference?: string; receiptUrl?: string | null }> {
  const fd = new FormData();
  fd.append("payload", JSON.stringify(order));
  fd.append("receipt", receipt);
  try {
    const res = await fetch("/api/order", { method: "POST", body: fd });
    return await res.json();
  } catch {
    return { ok: false };
  }
}

/**
 * Opens WhatsApp addressed to the OFFICIAL Ruaby line with the order details
 * pre-filled, so every order reliably reaches the same number (a share sheet
 * would let the customer pick the wrong chat). The receipt is already saved to
 * the admin + emailed by storeOrder(); the customer is prompted to also attach
 * it in the chat.
 */
export function submitOrder(order: OrderInput, receiptUrl?: string | null) {
  window.open(whatsappUrl(buildOrderMessage(order, receiptUrl)), "_blank", "noopener");
}
