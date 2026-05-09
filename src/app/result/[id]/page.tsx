import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("course_quiz_submissions")
    .select("id,name,email")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="bg-bg-dark min-h-screen flex flex-col">
      <div className="bg-surface-dark border-b border-border-dark px-5 py-4 text-center">
        <p className="text-xs text-txt-muted uppercase tracking-widest">
          Marketing Architecture Quiz
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-5">
        <div className="mx-auto max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-txt-light mb-3">
            {data.name}, გმადლობ!
          </h1>

          <p className="text-base text-txt-muted leading-relaxed mb-2">
            შედეგების სანახავად შეამოწმე შენი ელ. ფოსტა.
          </p>

          <p className="text-sm text-txt-muted">
            გამოგზავნეთ: <span className="text-txt-light">{data.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
