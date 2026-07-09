import { getSettings } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
          Site &amp; Offers
        </h1>
        <p className="text-[var(--color-ink)]/60">
          Control the hero, launch countdown, and the offer cards.
        </p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
