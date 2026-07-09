import { getOrders } from "@/lib/admin-data";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
          Bookings
        </h1>
        <p className="text-[var(--color-ink)]/60">
          Every order, with its payment receipt. Tap one to view and update it.
        </p>
      </header>
      <OrdersTable orders={orders} />
    </div>
  );
}
