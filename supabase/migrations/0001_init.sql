create extension if not exists "pgcrypto";

create table if not exists course_quiz_submissions (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- Lead fields
  name                  text not null,
  email                 text not null,
  company               text,
  role                  text,
  website               text,
  marketing_budget_range text,
  team_size             text,

  -- Raw answers
  answers               jsonb not null default '{}',

  -- Computed scores
  budget_use_score      int not null default 0,
  system_clarity_score  int not null default 0,
  course_fit_score      int not null default 0,

  -- Score labels
  budget_use_label      text not null default '',
  system_clarity_label  text not null default '',
  course_fit_label      text not null default '',

  -- Result
  primary_gap           text not null default '',
  result_type           text not null default '',
  seat_recommendation   text not null default '',

  -- Full result content (title, explanation, 7-day actions, etc.)
  result_summary        jsonb not null default '{}',

  -- Email
  email_sent            boolean not null default false,

  -- Tracking
  source                text not null default 'marketing_architecture_course_quiz',
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_term              text
);

-- Row-level security: service role can do anything; anon can only insert
alter table course_quiz_submissions enable row level security;

create policy "service_role_all" on course_quiz_submissions
  for all using (auth.role() = 'service_role');

create policy "anon_insert" on course_quiz_submissions
  for insert with check (true);
