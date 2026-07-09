const MAP: Record<string, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-[var(--color-rose)]/12 text-[var(--color-rose)]" },
  confirmed: { label: "Confirmed", cls: "bg-[var(--color-leaf)]/20 text-[var(--color-forest)]" },
  delivered: { label: "Delivered", cls: "bg-[var(--color-forest)] text-white" },
  cancelled: { label: "Cancelled", cls: "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/50" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? MAP.new;
  return (
    <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}
