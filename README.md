# Marketing Architecture Quiz

**Owner:** Davit Chkotua / Marketing Architect Studio  
**Live URL:** https://coursequiz.davitchkotua.com  
**GitHub:** https://github.com/davitchkotua/marketing-architecture-quiz  
**Language:** Georgian (ქართული)

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14.2.15 (App Router, TypeScript) |
| Styling | Tailwind CSS (custom MAS palette) |
| Database | Supabase (project: `shvzebnvqcqyvcddruki`) |
| Email | Resend (`hello@davitchkotua.com`) |
| Hosting | Vercel (auto-deploy from GitHub `main`) |
| Forms | React Hook Form + Zod |

---

## Project Structure

```
src/
  app/
    page.tsx              ← Landing page
    quiz/page.tsx         ← Quiz page (renders QuizClient)
    result/[id]/page.tsx  ← Thank you page (check email message)
    api/quiz/submit/route.ts  ← POST endpoint: validates → scores → saves → emails
  components/
    QuizClient.tsx        ← Full quiz UI (12 questions + lead form)
    ProgressBar.tsx       ← Progress bar component
  lib/
    quiz-data.ts          ← 12 questions, options, score modifiers, gap signals
    scoring.ts            ← computeScore() → budgetUseScore, systemClarityScore, courseFitScore, resultType, seatRecommendation
    results.ts            ← Georgian copy for 8 result types + 5 seat recommendations
    email.ts              ← sendQuizResultEmail() + sendLeadNotification()
    validation.ts         ← Zod schema for API input
    supabase.ts           ← Supabase client (server-side)
    analytics.ts          ← trackEvent() stub
supabase/migrations/
    0001_init.sql         ← Table creation + RLS policies
```

---

## Environment Variables

Set in Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://shvzebnvqcqyvcddruki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase dashboard → Project Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase dashboard → Project Settings → API>
RESEND_API_KEY=<get from resend.com → API Keys>
RESEND_FROM_EMAIL=hello@davitchkotua.com
DIAGNOSTIC_CALL_URL=https://example.com/diagnostic-call
MARKETING_MRI_URL=https://www.davitchkotua.com/mri
```

> Actual values are in `.env.local` (gitignored) and in Vercel → Project → Settings → Environment Variables.

Local development: copy to `.env.local` (already gitignored).

---

## Supabase Table: `course_quiz_submissions`

Key columns:
- `id` (uuid, primary key)
- `name`, `email`, `phone` (lead fields)
- `company`, `role`, `website`, `marketing_budget_range`, `team_size` (optional)
- `answers` (jsonb — raw quiz answers)
- `budget_use_score`, `system_clarity_score`, `course_fit_score` (int 0–100)
- `budget_use_label`, `system_clarity_label`, `course_fit_label` (text)
- `primary_gap` (text — one of: AUDIENCE, OFFER, TRUST, SALES_PATH, CONTROL, TEAM_AGENCY, LEARNING_PATH, MRI_NEED)
- `result_type` (text — one of 8 types, see scoring.ts)
- `seat_recommendation` (text — one of 5 types)
- `result_summary` (jsonb)
- `email_sent` (bool)
- `source` = `"marketing_architecture_course_quiz"`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

RLS: service_role has full access; anon can INSERT only.

---

## Scoring Logic (`src/lib/scoring.ts`)

Starting scores: `budgetUse=40`, `systemClarity=10`, `courseFit=25`

Each answer option has:
- `modifier` — adds/subtracts from the 3 scores
- `gapSignal` — weights toward a `primaryGap`

Final scores clamped to 0–100. `primaryGap` = highest weighted gap.

**Result types** (8): `BUDGET_NO_SYSTEM`, `GAP_AUDIENCE`, `GAP_OFFER`, `GAP_TRUST`, `GAP_SALES_PATH`, `GAP_CONTROL`, `PREMIUM_REVIEW`, `INDIVIDUAL_DIAGNOSIS`

**Seat recommendations** (5): `STANDARD_SEAT`, `PREMIUM_REVIEW_SEAT`, `BUSINESS_TEAM_SEAT`, `MARKETING_MRI`, `DIAGNOSTIC_CALL`

---

## Quiz Flow

1. Landing page (`/`) → CTA button → `/quiz`
2. 12 questions (Q1–Q11 = single choice, Q12 = single choice)
3. Lead form: name*, email*, phone (optional), + optional fields
4. Submit → `POST /api/quiz/submit`
5. API: validate → computeScore → insert Supabase → send result email to user → send notification to `hello@davitchkotua.com` → return `{id}`
6. Redirect to `/result/[id]` → shows "შედეგების სანახავად შეამოწმე შენი ელ. ფოსტა"

---

## Email Logic (`src/lib/email.ts`)

**Result email** (to user):
- Scores, primary gap, 7-day actions, seat recommendation
- If `courseFitScore >= 35`: shows course section + "დარეგისტრირდი კურსზე" (→ `https://www.davitchkotua.com/course`) + "დაჯავშნე Marketing MRI" button
- If `courseFitScore < 35`: "დიაგნოსტიკური ზარი" + "დაჯავშნე Marketing MRI" button

**Notification email** (to `hello@davitchkotua.com`):
- Subject: "მარკეტინგის კურსის ქვიზის ახალი ლიდი"
- Contains: name, email, phone

---

## Deployment

Push to `git@github.com:davitchkotua/marketing-architecture-quiz.git` (branch: `main`) → Vercel auto-deploys.

If pushing via HTTPS with token:
```
git push "https://davitchkotua:GITHUB_PAT@github.com/davitchkotua/marketing-architecture-quiz.git" main
```

---

## Common Tasks

### Add/edit a question
Edit `src/lib/quiz-data.ts` — each question has `id`, `number`, `title`, `type` (`single`/`multi`), `options[]`.

### Edit Georgian copy for result types
Edit `src/lib/results.ts` — `resultContent` and `seatContent` objects.

### Edit landing page
Edit `src/app/page.tsx`.

### Edit email template
Edit `src/lib/email.ts` — `buildHtml()` and `buildText()` functions.

### Run SQL migration
Open Supabase SQL Editor: https://supabase.com/dashboard/project/shvzebnvqcqyvcddruki/sql

### Update course URLs
Update in Vercel Environment Variables (no code change needed for `MARKETING_MRI_URL`, `DIAGNOSTIC_CALL_URL`). Course URL is hardcoded in `email.ts` as `https://www.davitchkotua.com/course`.
