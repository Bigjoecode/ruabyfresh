import { CartProvider } from "@/components/cart";
import { Aurora } from "@/components/ui";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Menu from "@/components/Menu";
import { WhyChoose, Gallery, Reviews, LaunchOffer, OrderCTA, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <CartProvider>
      <Aurora />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Menu />
        <LaunchOffer />
        <WhyChoose />
        <Gallery />
        <Reviews />
        <OrderCTA />
        <Footer />
      </main>
    </CartProvider>
  );
}
