alter table public.hotspots
  add column if not exists width integer not null default 18,
  add column if not exists height integer not null default 18,
  add column if not exists opacity numeric(3,2) not null default 1,
  add column if not exists hotspot_text text,
  add column if not exists text_position text not null default 'below';

alter table public.hotspots
  drop constraint if exists hotspots_text_position_check;

alter table public.hotspots
  add constraint hotspots_text_position_check
  check (text_position in ('inside', 'below'));
