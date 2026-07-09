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
  receiptAttached: boolean
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
    (receiptAttached
      ? `I've made the transfer — my payment receipt is attached.`
      : `I've made the transfer. Attaching my payment receipt now.`)
  );
}

/** WhatsApp deep link carrying the order message (text only). */
export function whatsappUrl(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Saves the order + receipt to the admin (via /api/order). Fire-and-forget:
 * returns the fetch promise so callers can .catch() but need not await
 * (so the WhatsApp share stays within the click's user-gesture window).
 */
export function storeOrder(order: OrderInput, receipt: File) {
  const fd = new FormData();
  fd.append("payload", JSON.stringify(order));
  fd.append("receipt", receipt);
  return fetch("/api/order", { method: "POST", body: fd });
}

/**
 * Sends the order. On devices that support sharing files (most phones), this
 * opens the native share sheet with the receipt image AND the order text so
 * the customer can send both to Ruaby Fresh on WhatsApp in one tap. On
 * desktop / unsupported browsers it falls back to a WhatsApp link (text only)
 * and the customer attaches the receipt manually.
 *
 * Returns how it was sent, or "cancelled" if the user dismissed the share sheet.
 */
export async function submitOrder(
  order: OrderInput,
  receipt: File
): Promise<"shared" | "whatsapp" | "cancelled"> {
  const canShareFile =
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [receipt] });

  if (canShareFile) {
    try {
      await navigator.share({
        title: "Ruaby Fresh Pre-order",
        text: buildOrderMessage(order, true),
        files: [receipt],
      });
      return "shared";
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "cancelled";
      // otherwise fall through to the WhatsApp link
    }
  }

  window.open(whatsappUrl(buildOrderMessage(order, false)), "_blank", "noopener");
  return "whatsapp";
}
