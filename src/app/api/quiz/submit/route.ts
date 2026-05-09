import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation";
import { computeScore } from "@/lib/scoring";
import { resultContent, seatContent } from "@/lib/results";
import { getServerSupabase } from "@/lib/supabase";
import { sendQuizResultEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const result = computeScore(data.answers);
  const content = resultContent[result.resultType];
  const seat = seatContent[result.seatRecommendation];

  const supabase = getServerSupabase();

  const insert = {
    name: data.name,
    email: data.email,
    company: data.company ?? null,
    role: data.role ?? null,
    website: data.website ?? null,
    marketing_budget_range: data.marketingBudgetRange ?? null,
    team_size: data.teamSize ?? null,
    answers: data.answers,
    budget_use_score: result.budgetUseScore,
    system_clarity_score: result.systemClarityScore,
    course_fit_score: result.courseFitScore,
    budget_use_label: result.budgetUseLabel,
    system_clarity_label: result.systemClarityLabel,
    course_fit_label: result.courseFitLabel,
    primary_gap: result.primaryGap,
    result_type: result.resultType,
    seat_recommendation: result.seatRecommendation,
    result_summary: {
      primary_gap_title: content.primaryGapTitle,
      explanation: content.explanation,
      seven_day_actions: content.sevenDayActions,
      seat_label: seat.label,
      seat_text: seat.text,
    },
    email_sent: false,
    source: "marketing_architecture_course_quiz",
    utm_source: data.utm?.utm_source ?? null,
    utm_medium: data.utm?.utm_medium ?? null,
    utm_campaign: data.utm?.utm_campaign ?? null,
    utm_content: data.utm?.utm_content ?? null,
    utm_term: data.utm?.utm_term ?? null,
  };

  const { data: row, error: insertError } = await supabase
    .from("course_quiz_submissions")
    .insert(insert)
    .select("id")
    .single();

  if (insertError || !row) {
    console.error("[quiz/submit] supabase insert failed", insertError);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  try {
    await sendQuizResultEmail({ to: data.email, name: data.name, result });
    await supabase
      .from("course_quiz_submissions")
      .update({ email_sent: true })
      .eq("id", row.id);
  } catch (e) {
    console.error("[quiz/submit] email send failed", e);
  }

  return NextResponse.json({ id: row.id });
}
