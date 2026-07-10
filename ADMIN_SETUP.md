# Ruaby Fresh — Admin setup (Supabase)

Your site works right now without this. Follow these steps once to switch on
the **admin** (track bookings, edit products, offers, and the hero) and to
**store receipts + orders**. ~10 minutes.

## 1. Create a Supabase project
- Go to **supabase.com** → sign up (free) → **New project**.
- Pick a name + a strong database password → **Create**. Wait ~2 min.

## 2. Create the tables + storage
- In the left sidebar: **SQL Editor → New query**.
- Open the file [`supabase/schema.sql`](supabase/schema.sql) from this repo,
  copy everything, paste it in, and click **Run**. You should see "Success".
  (This creates the `products`, `settings`, `orders` tables and the
  `receipts` / `product-images` / `hero-images` storage buckets.)

## 3. Create your admin login
- Sidebar: **Authentication → Users → Add user → Create new user**.
- Enter **your email + a password**, tick "Auto confirm user", and create it.
  (This is the login you'll use at `/admin`.)

## 4. Grab your keys
- Sidebar: **Project Settings → API**. You need three values:
  - **Project URL**
  - **anon public** key
  - **service_role** key (secret — keep it private)

## 5. Add the keys to Vercel
- In Vercel → your **ruabyfresh** project → **Settings → Environment
  Variables** → add these (Production + Preview + Development):

```
NEXT_PUBLIC_SUPABASE_URL      = <Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon public key>
SUPABASE_SERVICE_ROLE_KEY     = <service_role key>
ADMIN_EMAILS                  = your@email.com
```

- Redeploy (Vercel → Deployments → ⋯ → Redeploy, or push any commit).
  For local dev, put the same values in a `.env.local` file.

## 6. You're live
- Go to **ruabyfresh.vercel.app/admin** → sign in with the user from step 3.
- **Products →** click **"Load default products"** once to import the current
  catalogue, then edit prices, photos, ingredients, add/remove products.
- **Site & Offers →** edit the hero (headline, background, floating images),
  launch date/countdown, and the two offer cards.
- **Bookings →** every order appears here with its **payment receipt**; change
  status (new → confirmed → delivered) and message the customer on WhatsApp.

## 7. Make receipts private (recommended)
Receipts are now viewed through short-lived **signed URLs** in the admin. If you
ran the original `schema.sql` (which created a public `receipts` bucket), run
[`supabase/make-receipts-private.sql`](supabase/make-receipts-private.sql) once
in the SQL Editor to lock the bucket down. New Supabase projects get this
automatically from the updated schema.

## 8. Email on every new order (optional)
Get an instant email whenever a booking comes in:
1. Sign up free at **resend.com** → **API Keys → Create**.
2. (Optional but recommended) verify your domain under **Domains** so emails can
   come from e.g. `orders@ruabyfresh.com`. For testing you can skip this and use
   the default `onboarding@resend.dev` (it only delivers to your own Resend
   account email).
3. Add to Vercel env vars + redeploy:
   ```
   RESEND_API_KEY = re_xxx
   RESEND_FROM    = Ruaby Fresh <orders@yourdomain.com>   # or onboarding@resend.dev
   ```
Emails go to everyone in `ADMIN_EMAILS`. If `RESEND_API_KEY` is empty, this is
simply skipped — orders still save and open WhatsApp.

### Notes
- The public storefront updates within ~30 seconds of an admin change.
- `ADMIN_EMAILS` limits who can enter the admin even if they have a Supabase
  login. Leave it blank to allow any user you create in Supabase.
