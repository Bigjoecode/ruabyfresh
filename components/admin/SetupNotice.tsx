export default function SetupNotice() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-2xl place-items-center px-4">
      <div className="rounded-3xl border border-[var(--color-forest)]/15 bg-white p-8 shadow-xl">
        <h1 className="font-display text-3xl font-semibold text-[var(--color-forest)]">
          Admin setup needed
        </h1>
        <p className="mt-3 text-[var(--color-ink)]/70">
          The admin isn&apos;t connected to a database yet. To switch it on:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--color-ink)]/80">
          <li>
            Create a free project at <b>supabase.com</b>.
          </li>
          <li>
            In the Supabase <b>SQL Editor</b>, run the script in{" "}
            <code className="rounded bg-[var(--color-cream-deep)] px-1">supabase/schema.sql</code>.
          </li>
          <li>
            Create your login: <b>Authentication → Users → Add user</b> (email + password).
          </li>
          <li>
            Add these to Vercel → Settings → Environment Variables (and{" "}
            <code className="rounded bg-[var(--color-cream-deep)] px-1">.env.local</code>):
            <pre className="mt-2 overflow-x-auto rounded-xl bg-[var(--color-forest)] p-4 text-xs text-[var(--color-cream)]">
{`NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
ADMIN_EMAILS=you@email.com`}
            </pre>
          </li>
          <li>Redeploy. The site keeps working the whole time.</li>
        </ol>
      </div>
    </div>
  );
}
