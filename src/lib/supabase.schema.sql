-- Supabase SQL schema for NJSB DTR
-- Run this in the Supabase SQL Editor

-- 1. profiles: extends auth.users with admin metadata
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  role text not null default 'Manager',
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamp with time zone default now()
);

-- 2. interns: DTR intern records
create table interns (
  id text primary key, -- e.g. 'I-001'
  first_name text not null,
  last_name text not null,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  total_hours numeric not null default 0,
  accumulated_hours numeric not null default 0,
  username text, -- login username for mobile app
  email text unique, -- account email
  password text, -- login password (default: intern123)
  created_at timestamp with time zone default now()
);

-- 3. attendance: daily attendance records per intern
create table attendance (
  id uuid default gen_random_uuid() primary key,
  intern_id text references interns on delete cascade not null,
  date date not null,
  time_in time without time zone,
  time_out time without time zone,
  status text not null default 'PRESENT' check (status in ('PRESENT', 'ABSENT', 'LATE', 'UNDERTIME')),
  notes text,
  created_at timestamp with time zone default now(),
  unique (intern_id, date)
);

-- 4. reports: generated reports
create table reports (
  id text primary key, -- e.g. 'R-001'
  title text not null,
  type text not null check (type in ('Attendance', 'Summary')),
  generated_at date not null,
  owner text not null,
  created_at timestamp with time zone default now()
);

-- 5. holidays: calendar holiday markers
create table holidays (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  name text not null,
  created_at timestamp with time zone default now()
);

-- 6. qr_codes: generated QR codes for intern attendance check-in
create table qr_codes (
  id text primary key, -- e.g. 'QC-001'
  code text not null unique, -- the unique scan code / URL path
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS) for all tables
alter table profiles enable row level security;
alter table interns enable row level security;
alter table attendance enable row level security;
alter table reports enable row level security;
alter table holidays enable row level security;

-- Policies: allow authenticated users full access (adjust as needed for production)
create policy "Allow read/write for authenticated users" on profiles
  for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow read/write for authenticated users" on interns
  for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow read/write for authenticated users" on attendance
  for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow read/write for authenticated users" on reports
  for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow read/write for authenticated users" on holidays
  for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Allow read/write for authenticated users" on qr_codes
  for all to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Indexes for faster lookups
create index idx_attendance_intern_date on attendance(intern_id, date);
create index idx_attendance_date on attendance(date);
create index idx_holidays_date on holidays(date);
create index idx_interns_name on interns(first_name, last_name);
create index idx_reports_owner on reports(owner);
create index idx_qr_codes_active on qr_codes(is_active);
create index idx_qr_codes_code on qr_codes(code);

-- Migration: remove department column from interns
alter table interns drop column if exists department;
