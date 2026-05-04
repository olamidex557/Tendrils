do $$
begin
  if to_regclass('public.orders') is null then
    return;
  end if;

  alter table public.orders
  add column if not exists fulfillment_method text not null default 'delivery';

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_fulfillment_method_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
    add constraint orders_fulfillment_method_check
    check (fulfillment_method in ('delivery', 'pickup'));
  end if;

  create unique index if not exists idx_orders_order_number_unique
  on public.orders(order_number);
end $$;
