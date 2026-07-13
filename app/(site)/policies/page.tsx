import type { Metadata } from "next";
import { BRAND } from "@/lib/products";

export const metadata: Metadata = {
  title: "Policies — Ruaby Fresh",
  description:
    "Ruaby Fresh store regulations, delivery, refund, terms of service, privacy policy and FAQs.",
};

const nav = [
  { id: "regulations", label: "Store Regulations" },
  { id: "delivery", label: "Delivery Policy" },
  { id: "refund", label: "Refund Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "faqs", label: "FAQs" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-[28px] glass p-6 md:p-9">
      <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] font-semibold text-[var(--color-forest)]">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--color-ink)]/80">
        {children}
      </div>
    </section>
  );
}

function Q({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-forest)]/10 pb-3 last:border-0">
      <p className="font-semibold text-[var(--color-forest)]">{q}</p>
      <p className="mt-1 text-[var(--color-ink)]/75">{a}</p>
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 md:pt-32">
      <header className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)] ring-1 ring-[var(--color-leaf)]/40">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-rose)]" />
          Ruaby Fresh
        </span>
        <h1 className="mt-5 font-display text-[clamp(2.4rem,7vw,4rem)] font-semibold text-[var(--color-forest)]">
          Our Policies
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-ink)]/60">
          Please read these before ordering. They keep every order fresh, fair and
          smooth for everyone.
        </p>
      </header>

      {/* quick nav */}
      <nav className="mb-8 flex flex-wrap justify-center gap-2">
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-[var(--color-forest)] transition hover:bg-[var(--color-forest)] hover:text-white"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <div className="space-y-5">
        <Section id="regulations" title="Store Regulations">
          <p>
            Ruaby Fresh products are handcrafted fresh to order. To keep everything
            fresh and fair, the following apply to all orders:
          </p>
          <ul className="ml-5 list-disc space-y-2 marker:text-[var(--color-leaf)]">
            <li>
              <b>Operating hours:</b> Monday–Saturday, 8:00am–6:00pm; Sundays,
              12:00pm–5:00pm (WAT). Orders placed after our daily cut-off are
              prepared the next working day.
            </li>
            <li>
              <b>How to order:</b> through this website or our official WhatsApp line{" "}
              <a className="font-semibold text-[var(--color-forest)] underline" href={`https://wa.me/${BRAND.whatsapp}`}>
                {BRAND.whatsappDisplay}
              </a>
              . Orders are confirmed only after payment and a valid payment receipt
              are received.
            </li>
            <li>
              <b>Payment:</b> bank transfer to <b>{BRAND.bank.account}</b>,{" "}
              {BRAND.bank.name} — <b>{BRAND.bank.number}</b>. Kindly upload/send your
              receipt to complete the order.
            </li>
            <li>
              <b>Order changes:</b> changes or cancellations are only possible within
              a short window after placing your order, before preparation begins.
              Once we start preparing, changes may not be possible.
            </li>
            <li>
              <b>Pickup vs. delivery:</b> please select the correct option. Choosing
              the wrong option may attract a re-dispatch fee, communicated at
              confirmation.
            </li>
            <li>
              <b>Freshness:</b> all products are made fresh daily with no artificial
              preservatives. <b>Keep refrigerated</b> and consume within the
              recommended time.
            </li>
          </ul>
        </Section>

        <Section id="delivery" title="Delivery Policy">
          <ul className="ml-5 list-disc space-y-2 marker:text-[var(--color-leaf)]">
            <li>
              <b>Coverage:</b> we currently deliver within <b>{BRAND.city}</b> and
              nearby environs. We do not offer interstate or international shipping at
              this time.
            </li>
            <li>
              <b>Delivery fee:</b> depends on your location and is confirmed before
              dispatch.
            </li>
            <li>
              <b>Timing:</b> same-day delivery for orders placed before the daily
              cut-off; otherwise the next working day. Delivery times are estimates
              and may vary with traffic and weather.
            </li>
            <li>
              <b>On arrival:</b> our rider will wait up to <b>10 minutes</b>. If you
              are unavailable, a re-delivery fee may apply to reschedule.
            </li>
            <li>
              <b>Accurate details:</b> please provide a correct address and an active
              phone number. Ruaby Fresh is not responsible for failed deliveries
              caused by wrong details or unavailability.
            </li>
            <li>
              <b>Storage:</b> refrigerate immediately on receipt. We are not liable
              for spoilage caused by improper storage after delivery.
            </li>
          </ul>
        </Section>

        <Section id="refund" title="Refund Policy">
          <p>
            <b>1. Perishable products.</b> Because our yoghurt and parfaits are fresh,
            perishable food, orders cannot be returned or refunded once prepared or
            dispatched — including for change of mind, ordering mistakes, or personal
            taste. Once a product leaves our custody, it can no longer be resold for
            safety reasons.
          </p>
          <p>
            <b>2. Quality issues.</b> Your satisfaction matters. If there is a genuine
            problem with your order, report it within <b>4 hours</b> of receipt via
            WhatsApp ({BRAND.whatsappDisplay}) with clear photos. Verified issues will
            be resolved with a replacement or refund.
          </p>
          <p>
            <b>3. Customer negligence.</b> Ruaby Fresh is not liable for refunds where
            an issue is caused by an incorrect address, an unreachable phone number,
            the customer being unavailable at delivery, or improper storage after
            delivery.
          </p>
          <p>
            <b>4. Cancellations.</b> Orders cancelled within the short modification
            window (before preparation begins) are eligible for a refund, less any
            transfer/processing charges. After preparation begins, orders are
            generally non-refundable.
          </p>
          <p>
            <b>5. Processing.</b> Approved refunds are processed to your original
            payment method within <b>1–7 working days</b>, depending on banking
            cycles.
          </p>
        </Section>

        <Section id="terms" title="Terms of Service">
          <ul className="ml-5 list-disc space-y-2 marker:text-[var(--color-leaf)]">
            <li>
              By placing an order you agree to these policies in full.
            </li>
            <li>
              All prices are in Nigerian Naira (₦) and may change without prior
              notice. Launch/promotional prices apply only for the stated period.
            </li>
            <li>
              Product photos are for illustration; actual items may vary slightly in
              appearance while meeting the same quality.
            </li>
            <li>
              Ruaby Fresh may refuse or cancel any order suspected of fraud or abuse.
            </li>
            <li>
              These terms are governed by the applicable laws of the Federal Republic
              of Nigeria.
            </li>
          </ul>
        </Section>

        <Section id="privacy" title="Privacy Policy">
          <p>
            We only collect the information needed to fulfil your order — your name,
            phone number, delivery address, and payment receipt.
          </p>
          <ul className="ml-5 list-disc space-y-2 marker:text-[var(--color-leaf)]">
            <li>Your details are used solely to process, deliver and support your order.</li>
            <li>We do not sell or rent your personal information to third parties.</li>
            <li>Payment receipts are stored securely and used only to verify payment.</li>
            <li>
              You may request an update or deletion of your information anytime via{" "}
              <a className="font-semibold text-[var(--color-forest)] underline" href={`https://wa.me/${BRAND.whatsapp}`}>
                WhatsApp
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section id="faqs" title="Frequently Asked Questions">
          <div className="space-y-3">
            <Q q="Where do you deliver?" a={<>Within {BRAND.city} and nearby environs. Pickup is also available.</>} />
            <Q
              q="How do I pay?"
              a={
                <>
                  By bank transfer to <b>{BRAND.bank.account}</b>, {BRAND.bank.name} —{" "}
                  <b>{BRAND.bank.number}</b>. Then upload/send your receipt to confirm.
                </>
              }
            />
            <Q q="Are the products fresh?" a="Yes — made fresh daily with premium ingredients and no artificial preservatives. Please keep refrigerated." />
            <Q q="Do you take bulk orders?" a={<>Yes. Bulk pricing applies from 12 units — reach us on WhatsApp ({BRAND.whatsappDisplay}) to arrange.</>} />
            <Q q="Can I order a single cup?" a="Absolutely — single and bulk orders are both welcome." />
            <Q q="How long do products last?" a="For best taste and safety, consume within the recommended time and always keep refrigerated." />
          </div>
        </Section>

        {/* contact */}
        <section className="rounded-[28px] bg-[var(--color-forest)] p-8 text-center text-[var(--color-cream)] md:p-10">
          <p className="font-display text-2xl font-semibold">Still have a question?</p>
          <p className="mt-2 text-[var(--color-cream)]/75">
            We&apos;re happy to help — reach us any time.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href={`https://wa.me/${BRAND.whatsapp}`} className="rounded-full bg-[var(--color-leaf)] px-6 py-3 font-semibold text-[var(--color-forest-deep)] transition hover:scale-105">
              WhatsApp {BRAND.whatsappDisplay}
            </a>
            <a href={BRAND.instagram} className="rounded-full bg-white/15 px-6 py-3 font-semibold text-[var(--color-cream)] transition hover:bg-white/25">
              Instagram
            </a>
            <a href={BRAND.tiktok} className="rounded-full bg-white/15 px-6 py-3 font-semibold text-[var(--color-cream)] transition hover:bg-white/25">
              TikTok
            </a>
            <a href={BRAND.facebook} className="rounded-full bg-white/15 px-6 py-3 font-semibold text-[var(--color-cream)] transition hover:bg-white/25">
              Facebook
            </a>
          </div>
        </section>

        <p className="text-center text-xs text-[var(--color-ink)]/45">
          Last updated {new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })}. Ruaby Fresh reserves the right to update these policies at any time.
        </p>
      </div>
    </main>
  );
}
