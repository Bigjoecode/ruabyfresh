"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { ORDER_STATUSES } from "@/lib/types";
import { updateOrderStatus, deleteOrder } from "@/lib/actions";
import StatusBadge from "./StatusBadge";

export default function StatusChanger({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--color-forest)]">Status</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              disabled={pending}
              onClick={() => start(() => updateOrderStatus(id, s).then(() => router.refresh()))}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold capitalize transition disabled:opacity-50 ${
                status === s
                  ? "border-transparent bg-[var(--color-forest)] text-white"
                  : "border-[var(--color-forest)]/20 bg-white text-[var(--color-ink)]/70 hover:border-[var(--color-leaf)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="border-t border-[var(--color-forest)]/10 pt-4">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-ink)]/70">Delete this booking?</span>
            <button
              disabled={pending}
              onClick={() => start(() => deleteOrder(id).then(() => router.push("/admin/orders")))}
              className="cursor-pointer rounded-full bg-[var(--color-strawberry)] px-4 py-1.5 text-sm font-semibold text-white"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="cursor-pointer rounded-full bg-[var(--color-cream-deep)] px-4 py-1.5 text-sm font-semibold text-[var(--color-ink)]/70"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm font-medium text-[var(--color-strawberry)] hover:underline"
          >
            Delete booking
          </button>
        )}
      </div>
    </div>
  );
}
