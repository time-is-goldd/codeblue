-- DATA_SCHEMA.md 6.3 / ARCHITECTURE.md 6.2 기준 inquiries 테이블 + RLS 정책.
-- Supabase 프로젝트의 SQL Editor(또는 `supabase db push`)에서 실행한다.

create extension if not exists pgcrypto;

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  company_name text,
  industry text,
  budget_range text,
  message text not null,
  status text not null default 'new' check (status in ('new','in-progress','completed','archived')),
  source text,
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_status on inquiries(status, created_at desc);

alter table inquiries enable row level security;

-- 익명(anon) 사용자는 INSERT만 허용한다 (Contact 폼 제출용).
-- SELECT/UPDATE/DELETE 정책은 의도적으로 만들지 않는다 — 관리자 인증(admin_users,
-- ARCHITECTURE.md 14장)이 구현되는 시점에 관리자 전용 조회 정책을 추가한다.
create policy "Allow public insert on inquiries"
  on inquiries
  for insert
  to anon
  with check (true);
