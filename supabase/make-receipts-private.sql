-- Run this ONCE in Supabase → SQL Editor if you already ran the original
-- schema.sql (which created `receipts` as a public bucket). It flips receipts
-- to private so payment screenshots are only viewable through the short-lived
-- signed URLs generated inside the admin.

update storage.buckets set public = false where id = 'receipts';

drop policy if exists "public read buckets" on storage.objects;
create policy "public read buckets" on storage.objects for select
  using (bucket_id in ('product-images','hero-images'));
