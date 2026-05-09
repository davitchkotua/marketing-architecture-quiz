"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { quizQuestions, marketingBudgetRanges, teamSizeRanges } from "@/lib/quiz-data";
import { trackEvent } from "@/lib/analytics";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

const leadSchema = z.object({
  name: z.string().min(1, "სახელი სავალდებულოა"),
  email: z.string().email("ელფოსტა არასწორია"),
  phone: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "გთხოვ, დაეთანხმე" }),
  }),
  company: z.string().optional(),
  role: z.string().optional(),
  website: z.string().optional(),
  marketingBudgetRange: z.string().optional(),
  teamSize: z.string().optional(),
});

type LeadForm = z.infer<typeof leadSchema>;

const TOTAL_STEPS = quizQuestions.length + 1; // +1 for lead form

export default function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = question index; quizQuestions.length = lead form
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = step < quizQuestions.length ? quizQuestions[step] : null;
  const isLeadForm = step === quizQuestions.length;
  const progressStep = step + 1;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LeadForm>({ resolver: zodResolver(leadSchema) });

  useEffect(() => {
    if (step === 0) trackEvent("quiz_started");
  }, [step]);

  const getAnswer = (qid: string): AnswerValue | undefined => answers[qid];

  const toggleSingle = (qid: string, key: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  };

  const toggleMulti = (qid: string, key: string) => {
    setAnswers((prev) => {
      const current = (prev[qid] as string[] | undefined) ?? [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { ...prev, [qid]: next };
    });
  };

  const canAdvance = useCallback((): boolean => {
    if (!currentQuestion) return true;
    const ans = getAnswer(currentQuestion.id);
    if (!ans) return false;
    if (currentQuestion.type === "multi") return (ans as string[]).length > 0;
    return typeof ans === "string" && ans.length > 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, answers]);

  const goNext = () => {
    if (!canAdvance()) return;
    trackEvent("quiz_step_completed", { step, questionId: currentQuestion?.id });
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (lead: LeadForm) => {
    setSubmitting(true);
    setError(null);

    const utm: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(
        (k) => { if (params.get(k)) utm[k] = params.get(k)!; }
      );
    }

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, ...lead, utm }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "გთხოვ, კიდევ სცადე");
      }

      const { id } = await res.json();
      trackEvent("quiz_submitted");
      router.push(`/result/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "გთხოვ, კიდევ სცადე");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Progress */}
      <div className="bg-surface-dark border-b border-border-dark px-5 py-4">
        <div className="mx-auto max-w-xl">
          <ProgressBar current={progressStep} total={TOTAL_STEPS} />
        </div>
      </div>

      <div className="flex-1 px-5 py-8">
        <div className="mx-auto max-w-xl">
          {/* Question step */}
          {currentQuestion && (
            <div className="animate-fadein">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">
                კითხვა {currentQuestion.number}
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-txt-light leading-snug mb-2">
                {currentQuestion.title}
              </h2>
              {currentQuestion.helperText && (
                <p className="text-sm text-txt-muted mb-6">{currentQuestion.helperText}</p>
              )}
              {!currentQuestion.helperText && <div className="mb-6" />}

              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const ans = getAnswer(currentQuestion.id);
                  const selected =
                    currentQuestion.type === "single"
                      ? ans === opt.key
                      : Array.isArray(ans) && ans.includes(opt.key);

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        currentQuestion.type === "single"
                          ? toggleSingle(currentQuestion.id, opt.key)
                          : toggleMulti(currentQuestion.id, opt.key)
                      }
                      className={`w-full text-left px-5 py-4 rounded-xl border text-sm leading-snug transition-all duration-150 ${
                        selected
                          ? "border-accent bg-accent/10 text-txt-light font-medium"
                          : "border-border-dark bg-surface-dark text-txt-light/80 hover:border-accent/50 hover:bg-surface-dark/80"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded mr-3 text-xs font-bold flex-shrink-0 align-middle ${
                          selected
                            ? "bg-accent text-bg-dark"
                            : "bg-border-dark text-txt-muted"
                        }`}
                      >
                        {opt.key}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Nav buttons */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 py-3 rounded-xl border border-border-dark text-txt-muted text-sm hover:border-accent/40 transition"
                  >
                    უკან
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance()}
                  className={`flex-[2] py-3 rounded-xl text-sm font-semibold transition ${
                    canAdvance()
                      ? "bg-accent text-bg-dark hover:bg-accent-dark"
                      : "bg-border-dark text-txt-muted cursor-not-allowed"
                  }`}
                >
                  შემდეგი
                </button>
              </div>
            </div>
          )}

          {/* Lead form */}
          {isLeadForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="animate-fadein">
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">
                ბოლო ნაბიჯი
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-txt-light leading-snug mb-2">
                სად გამოგიგზავნოთ შედეგი?
              </h2>
              <p className="text-sm text-txt-muted mb-8">
                შედეგს ელფოსტაზე გამოგიგზავნით. ტელეფონის ნომრის დატოვება სურვილისამებრ არის.
              </p>

              {/* Required */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-txt-light mb-1.5">
                    სახელი <span className="text-accent">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="შენი სახელი"
                    className="input-field"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-txt-light mb-1.5">
                    ელფოსტა <span className="text-accent">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="email@example.com"
                    className="input-field"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-txt-light mb-1.5">
                    ტელეფონი <span className="text-txt-muted text-xs">(სურვილისამებრ)</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+995 5XX XXX XXX"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Optional */}
              <details className="mb-6 group">
                <summary className="text-sm text-txt-muted cursor-pointer hover:text-txt-light transition list-none flex items-center gap-2">
                  <svg className="w-4 h-4 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  დამატებითი ინფორმაცია (სურვილისამებრ)
                </summary>
                <div className="mt-4 space-y-4 pl-6">
                  <div>
                    <label className="block text-sm text-txt-light mb-1.5">კომპანია</label>
                    <input {...register("company")} placeholder="კომპანიის სახელი" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-txt-light mb-1.5">შენი როლი</label>
                    <input {...register("role")} placeholder="მფლობელი, დირექტორი, მარკეტერი..." className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-txt-light mb-1.5">ვებსაიტი ან სოც. გვერდი</label>
                    <input {...register("website")} placeholder="https://..." className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm text-txt-light mb-1.5">თვიური მარკეტინგის ბიუჯეტი</label>
                    <select {...register("marketingBudgetRange")} className="input-field">
                      <option value="">— არჩიე —</option>
                      {marketingBudgetRanges.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-txt-light mb-1.5">გუნდის ზომა</label>
                    <select {...register("teamSize")} className="input-field">
                      <option value="">— არჩიე —</option>
                      {teamSizeRanges.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </details>

              {/* Consent */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    {...register("consent")}
                    type="checkbox"
                    className="mt-0.5 accent-accent"
                  />
                  <span className="text-sm text-txt-muted leading-relaxed">
                    ვეთანხმები, რომ Marketing Architecture Quiz-ის შედეგები და დაკავშირებული რეკომენდაციები ელფოსტაზე მივიღო.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-red-400 mt-1">{errors.consent.message}</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-400 mb-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl border border-border-dark text-txt-muted text-sm hover:border-accent/40 transition"
                >
                  უკან
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-3 rounded-xl bg-accent text-bg-dark text-sm font-semibold hover:bg-accent-dark transition disabled:opacity-60"
                >
                  {submitting ? "იგზავნება..." : "შედეგის მიღება"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
