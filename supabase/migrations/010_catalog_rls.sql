alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_attributes enable row level security;
alter table public.product_variants enable row level security;
alter table public.banners enable row level security;

create policy "public can read visible categories"
on public.categories
for select
to anon, authenticated
using (is_visible = true);

create policy "public can read published products"
on public.products
for select
to anon, authenticated
using (status = 'published');

create policy "public can read attributes for published products"
on public.product_attributes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_attributes.product_id
      and p.status = 'published'
  )
);

create policy "public can read active variants for published products"
on public.product_variants
for select
to anon, authenticated
using (
  status = 'active'
  and exists (
    select 1
    from public.products p
    where p.id = product_variants.product_id
      and p.status = 'published'
  )
);

create policy "public can read active and scheduled banners"
on public.banners
for select
to anon, authenticated
using (status in ('active', 'scheduled'));