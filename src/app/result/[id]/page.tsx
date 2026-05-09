import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import { resultContent, seatContent } from "@/lib/results";
import type { ResultType, SeatRecommendation } from "@/lib/scoring";

export const dynamic = "force-dynamic";

interface ResultRow {
  id: string;
  name: string;
  email: string;
  budget_use_score: number;
  system_clarity_score: number;
  course_fit_score: number;
  budget_use_label: string;
  system_clarity_label: string;
  course_fit_label: string;
  primary_gap: string;
  result_type: ResultType;
  seat_recommendation: SeatRecommendation;
  result_summary: {
    primary_gap_title: string;
    explanation: string;
    seven_day_actions: string[];
  };
}

function ScoreCard({
  label,
  score,
  scoreLabel,
}: {
  label: string;
  score: number;
  scoreLabel: string;
}) {
  return (
    <div className="card-dark flex flex-col gap-3">
      <p className="text-xs text-txt-muted uppercase tracking-widest">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-accent">{score}%</span>
        <span className="text-sm font-semibold text-txt-light">{scoreLabel}</span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("course_quiz_submissions")
    .select(
      "id,name,email,budget_use_score,system_clarity_score,course_fit_score,budget_use_label,system_clarity_label,course_fit_label,primary_gap,result_type,seat_recommendation,result_summary"
    )
    .eq("id", params.id)
    .single<ResultRow>();

  if (error || !data) notFound();

  const content = resultContent[data.result_type] ?? resultContent["GAP_CONTROL"];
  const seat = seatContent[data.seat_recommendation] ?? seatContent["DIAGNOSTIC_CALL"];

  const courseUrl = process.env.COURSE_URL || "#";
  const webinarUrl = process.env.WEBINAR_URL || "#";
  const premiumReviewUrl = process.env.PREMIUM_REVIEW_URL || "#";
  const diagnosticCallUrl = process.env.DIAGNOSTIC_CALL_URL || "#";

  const showCourse = data.course_fit_score >= 35;

  return (
    <div className="bg-bg-dark min-h-screen pb-20">
      {/* Header */}
      <div className="bg-surface-dark border-b border-border-dark px-5 py-4 text-center">
        <p className="text-xs text-txt-muted uppercase tracking-widest">
          Marketing Architecture Quiz · საწყისი შეფასება
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-5 pt-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-txt-light leading-snug">
            {data.name}, შენი შედეგი მზადაა
          </h1>
          <p className="mt-2 text-sm text-txt-muted">
            ქვემოთ არის შენი საწყისი შეფასება. შედეგი ელფოსტაზეც გამოგეგზავნა.
          </p>
        </div>

        {/* Scores */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <ScoreCard
            label="ბიუჯეტის გამოყენება"
            score={data.budget_use_score}
            scoreLabel={data.budget_use_label}
          />
          <ScoreCard
            label="სისტემის სიცხადე"
            score={data.system_clarity_score}
            scoreLabel={data.system_clarity_label}
          />
          <ScoreCard
            label="კურსის შესაბამისობა"
            score={data.course_fit_score}
            scoreLabel={data.course_fit_label}
          />
        </div>

        {/* Primary gap */}
        <div className="card-dark mb-6">
          <p className="text-xs text-txt-muted uppercase tracking-widest mb-2">
            პირველი დასალაგებელი ზონა
          </p>
          <h2 className="text-xl font-bold text-accent mb-4">
            {content.primaryGapTitle}
          </h2>
          <p className="text-sm text-txt-muted leading-relaxed">
            {content.explanation}
          </p>
        </div>

        {/* 7-day plan */}
        <div className="card-dark mb-6">
          <p className="text-xs text-txt-muted uppercase tracking-widest mb-4">
            7-დღიანი მოქმედებები
          </p>
          <ol className="space-y-3">
            {content.sevenDayActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-txt-muted leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Seat recommendation */}
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 mb-8">
          <p className="text-xs text-accent uppercase tracking-widest mb-2">
            რეკომენდებული შემდეგი ნაბიჯი
          </p>
          <p className="text-base font-semibold text-txt-light mb-2">{seat.label}</p>
          <p className="text-sm text-txt-muted leading-relaxed">{seat.text}</p>
        </div>

        {/* Course section */}
        {showCourse && (
          <div className="card-dark mb-6">
            <p className="text-xs text-txt-muted uppercase tracking-widest mb-3">
              კურსი
            </p>
            <h3 className="text-lg font-bold text-txt-light leading-snug mb-3">
              მარკეტინგის არქიტექტურა: ქაოსიდან მართვად სისტემამდე
            </h3>
            <p className="text-sm text-txt-muted leading-relaxed mb-5">
              შენი პასუხების მიხედვით, შენთვის სასარგებლო იქნება პროგრამა{" "}
              <em>„მარკეტინგის არქიტექტურა: ქაოსიდან მართვად სისტემამდე"</em>, რადგან ის
              არ არის უბრალოდ თეორიული კურსი. ეს არის guided self-build სამუშაო ფორმატი,
              სადაც შენს ბიზნესზე აწყობ მარკეტინგის სამუშაო რუკას.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "7 კვირიანი live სამუშაო პროგრამა",
                "Marketing Architecture Blueprint / მარკეტინგის სამუშაო რუკა",
                "ერთი არჩეული გაყიდვამდე გზა",
                "ერთი გაყიდვის აქტივი",
                "Weekly Marketing Control Sheet",
                "Launch Checklist",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-txt-muted">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          {showCourse ? (
            <>
              <a
                href={courseUrl}
                className="btn-primary text-center text-sm py-4"
              >
                დარეგისტრირდი კურსზე
              </a>
              <a href={webinarUrl} className="btn-secondary text-center text-sm py-3.5">
                დარეგისტრირდი ვებინარზე
              </a>
              <a
                href={premiumReviewUrl}
                className="btn-secondary text-center text-sm py-3.5"
              >
                მინდა Premium / Review Seat-ის განხილვა
              </a>
            </>
          ) : (
            <a
              href={diagnosticCallUrl}
              className="btn-primary text-center text-sm py-4"
            >
              მინდა დიაგნოსტიკური ზარი
            </a>
          )}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-txt-muted leading-relaxed text-center border-t border-border-dark pt-6">
          ეს არის საწყისი შეფასება და არა სრული Marketing MRI ან ინდივიდუალური კონსულტაცია. ზუსტი მიზეზების დასადგენად საჭიროა უფრო ღრმა ანალიზი.
        </p>
      </div>
    </div>
  );
}
