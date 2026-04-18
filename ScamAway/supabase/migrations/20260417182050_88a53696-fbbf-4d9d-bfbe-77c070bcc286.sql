-- App role enum (kept simple; future-proofs admin moderation)
create type public.app_role as enum ('admin', 'user');

-- Audience track enum
create type public.audience_track as enum ('teen', 'adult', 'senior');

-- Profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  audience audience_track not null default 'adult',
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles readable by everyone"
  on public.profiles for select using (true);

create policy "Users insert own profile"
  on public.profiles for insert with check (auth.uid() = user_id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = user_id);

-- User roles (separate table per security best practice)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create policy "Users read own roles"
  on public.user_roles for select using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Lesson progress
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users read own lesson progress"
  on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users insert own lesson progress"
  on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users delete own lesson progress"
  on public.lesson_progress for delete using (auth.uid() = user_id);

-- Scenario runs (practice + test results)
create table public.scenario_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  mode text not null check (mode in ('practice','test')),
  score integer not null default 0,
  outcome text not null check (outcome in ('safe','scammed','partial')),
  red_flags_caught integer not null default 0,
  red_flags_total integer not null default 0,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.scenario_runs enable row level security;

create policy "Users read own runs"
  on public.scenario_runs for select using (auth.uid() = user_id);
create policy "Users insert own runs"
  on public.scenario_runs for insert with check (auth.uid() = user_id);

create index idx_scenario_runs_user on public.scenario_runs(user_id);

-- Updated-at trigger
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, audience)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'audience')::audience_track, 'adult')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public leaderboard view (top 50 by xp)
create or replace view public.leaderboard as
  select display_name, audience, xp, updated_at
  from public.profiles
  order by xp desc
  limit 50;

grant select on public.leaderboard to anon, authenticated;