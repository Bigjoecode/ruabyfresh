import { LAUNCH_DATE } from "./products";

/** Editable site configuration (stored as one JSON row in the `settings` table). */
export type Settings = {
  launchDate: string; // ISO datetime
  launchOffer: boolean;
  hero: {
    badge: string;
    titleTop: string;
    titleBottom: string;
    subtitle: string;
    backgroundImage: string; // optional; "" = aurora gradient only
    showDrip: boolean;
    floatingImages: string[]; // optional image URLs; [] = use product photos
  };
  offer: {
    parfaitBadge: string;
    parfaitAmount: string;
    parfaitHeading: string;
    parfaitSub: string;
    yoghurtNow: string;
    yoghurtWas: string;
    yoghurtSub: string;
    bannerImage: string; // full-width promo banner under the offer cards
  };
  gallery: string[]; // gallery images shown on the storefront ("The Feed")
};

export const defaultSettings: Settings = {
  launchDate: LAUNCH_DATE.toISOString(),
  launchOffer: true,
  hero: {
    badge: "Launching 14 July 2026 · Pre-order now",
    titleTop: "Fresh Vibes",
    titleBottom: "Only.",
    subtitle:
      "Handcrafted parfaits & creamy yoghurt drinks — layered by hand, made fresh daily, and never touched by artificial preservatives.",
    backgroundImage: "",
    showDrip: true,
    floatingImages: [],
  },
  offer: {
    parfaitBadge: "Launch Offer · Limited time",
    parfaitAmount: "₦1,000 OFF",
    parfaitHeading: "Every parfait",
    parfaitSub:
      "Be among the first to enjoy freshness in every layer — 250ml, 330ml & 500ml, ₦1,000 off each.",
    yoghurtNow: "₦2,500",
    yoghurtWas: "₦3,000",
    yoghurtSub:
      "Strawberry, Banana & Vanilla — rich, creamy & made fresh daily.",
    bannerImage: "",
  },
  gallery: [],
};

/** An order/booking row as stored in the `orders` table. */
export type Order = {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_phone: string | null;
  fulfilment: string | null;
  address: string | null;
  note: string | null;
  items: { name: string; qty: number; price: number }[];
  total: number;
  bulk: boolean;
  receipt_url: string | null;
  status: string;
  created_at: string;
};

export const ORDER_STATUSES = ["new", "confirmed", "delivered", "cancelled"] as const;
