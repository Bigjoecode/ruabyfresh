import { CartProvider } from "@/components/cart";
import { Aurora } from "@/components/ui";
import Navbar from "@/components/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Aurora />
      <Navbar />
      {children}
    </CartProvider>
  );
}
