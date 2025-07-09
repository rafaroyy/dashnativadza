-- Habilita a extensão pgcrypto para usar gen_random_uuid()
create extension if not exists "pgcrypto" with schema "extensions";

-- Tabela de Usuários
create table if not exists "public"."users" (
    "id" uuid not null default auth.uid(),
    "email" text not null,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    primary key (id)
);
alter table "public"."users" enable row level security;
create policy "Allow public read-only access" on "public"."users" for select using (true);
create policy "Allow individual update access" on "public"."users" for update using (auth.uid() = id);

-- Tabela de Workspaces
create table if not exists "public"."workspaces" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "owner_id" uuid not null references public.users(id) on delete cascade,
    "created_at" timestamp with time zone not null default now(),
    primary key (id)
);
alter table "public"."workspaces" enable row level security;
create policy "Allow read access to members" on "public"."workspaces" for select using (auth.uid() = owner_id); -- Simplificado, idealmente teria uma tabela de membros
create policy "Allow insert for authenticated users" on "public"."workspaces" for insert with check (auth.uid() = owner_id);
create policy "Allow update for owners" on "public"."workspaces" for update using (auth.uid() = owner_id);
create policy "Allow delete for owners" on "public"."workspaces" for delete using (auth.uid() = owner_id);

-- Tabela de Espaços (Spaces)
create table if not exists "public"."spaces" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "color" text default '#00FFD1',
    "workspace_id" uuid not null references public.workspaces(id) on delete cascade,
    "created_at" timestamp with time zone not null default now(),
    primary key (id)
);
alter table "public"."spaces" enable row level security;
create policy "Allow read access via workspace" on "public"."spaces" for select using (
  exists (
    select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()
  )
);
create policy "Allow insert access via workspace" on "public"."spaces" for insert with check (
  exists (
    select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()
  )
);

-- Tabela de Tarefas (Tasks)
create table if not exists "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "status" text not null default 'todo',
    "priority" text not null default 'normal',
    "due_date" timestamp with time zone,
    "space_id" uuid not null references public.spaces(id) on delete cascade,
    "assignee_id" uuid references public.users(id) on delete set null,
    "created_at" timestamp with time zone not null default now(),
    primary key (id)
);
alter table "public"."tasks" enable row level security;
create policy "Allow read access via space" on "public"."tasks" for select using (
  exists (
    select 1 from public.spaces s
    join public.workspaces w on s.workspace_id = w.id
    where s.id = space_id and w.owner_id = auth.uid()
  )
);
create policy "Allow insert access via space" on "public"."tasks" for insert with check (
  exists (
    select 1 from public.spaces s
    join public.workspaces w on s.workspace_id = w.id
    where s.id = space_id and w.owner_id = auth.uid()
  )
);
create policy "Allow update access via space" on "public"."tasks" for update using (
  exists (
    select 1 from public.spaces s
    join public.workspaces w on s.workspace_id = w.id
    where s.id = space_id and w.owner_id = auth.uid()
  )
);
create policy "Allow delete access via space" on "public"."tasks" for delete using (
  exists (
    select 1 from public.spaces s
    join public.workspaces w on s.workspace_id = w.id
    where s.id = space_id and w.owner_id = auth.uid()
  )
);
