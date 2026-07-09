import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Menu from "@/components/Menu";
import PreorderForm from "@/components/PreorderForm";
import {
  WhyChoose,
  Gallery,
  Reviews,
  LaunchOffer,
  OrderCTA,
  Footer,
} from "@/components/Sections";
import { Eyebrow, Reveal } from "@/components/ui";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Menu />
      <LaunchOffer />
      <WhyChoose />
      <Gallery />
      <Reviews />

      <section id="preorder" className="relative mx-auto max-w-3xl px-4 py-24 md:py-28">
        <Reveal className="mb-8 text-center">
          <Eyebrow>Pre-order</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,3.6rem)] font-semibold text-[var(--color-forest)]">
            Reserve your <span className="italic text-gradient">first taste</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-ink)]/60">
            Fill this in and we&apos;ll confirm your order on WhatsApp. Pay by transfer,
            attach your receipt, and you&apos;re set.
          </p>
        </Reveal>
        <Reveal>
          <PreorderForm />
        </Reveal>
      </section>

      <OrderCTA />
      <Footer />
    </main>
  );
}
