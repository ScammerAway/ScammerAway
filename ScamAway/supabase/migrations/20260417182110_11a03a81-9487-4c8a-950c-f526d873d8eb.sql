drop view if exists public.leaderboard;

create view public.leaderboard
with (security_invoker = true) as
  select display_name, audience, xp, updated_at
  from public.profiles
  order by xp desc
  limit 50;

grant select on public.leaderboard to anon, authenticated;