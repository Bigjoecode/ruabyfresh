import { BRAND, formatNaira } from "./products";

export type Customer = {
  name: string;
  phone: string;
  type: "delivery" | "pickup";
  address?: string;
  note?: string;
};

export type OrderLine = { name: string; qty: number; price: number };

/** Short human order reference, e.g. RUABY-7F3K9. */
export function orderRef() {
  return "RUABY-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

/** Builds a WhatsApp deep link with a fully formatted pre-order message. */
export function whatsappOrderLink({
  lines,
  total,
  customer,
  reference,
  bulk,
  paid,
}: {
  lines: OrderLine[];
  total: number;
  customer: Customer;
  reference: string;
  bulk?: boolean;
  paid?: boolean;
}) {
  const items = lines
    .map((l) => `• ${l.qty} × ${l.name} — ${formatNaira(l.price * l.qty)}`)
    .join("\n");

  const fulfilment =
    customer.type === "delivery"
      ? `🚚 Delivery to: ${customer.address || "(address to follow)"}`
      : "🏬 Pickup";

  const msg =
    `🍓 *Ruaby Fresh — Pre-order ${reference}*\n\n` +
    `${items}\n\n` +
    `*Total: ${formatNaira(total)}*${bulk ? " (bulk price)" : ""}\n\n` +
    `👤 ${customer.name}\n` +
    `📞 ${customer.phone}\n` +
    `${fulfilment}\n` +
    (customer.note ? `📝 ${customer.note}\n` : "") +
    `\n💳 Payment — bank transfer to:\n` +
    `${BRAND.bank.account}\n${BRAND.bank.name} • ${BRAND.bank.number}\n` +
    (paid
      ? `\n✅ I've made the transfer and will attach my receipt in this chat.`
      : `\nI'll make the transfer and attach my receipt here.`);

  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
}
