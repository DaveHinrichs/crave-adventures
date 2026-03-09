alter table public.hotspots
  add column if not exists marker_border_color text not null default '#ffffff',
  add column if not exists marker_border_width integer not null default 2;

alter table public.hotspots
  drop constraint if exists hotspots_marker_border_width_check;

alter table public.hotspots
  add constraint hotspots_marker_border_width_check
  check (marker_border_width >= 0 and marker_border_width <= 20);
