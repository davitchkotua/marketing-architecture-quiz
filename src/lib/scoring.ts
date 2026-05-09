import { quizQuestions, type PrimaryGap } from "./quiz-data";

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export interface ScoreResult {
  budgetUseScore: number;
  systemClarityScore: number;
  courseFitScore: number;
  budgetUseLabel: string;
  systemClarityLabel: string;
  courseFitLabel: string;
  primaryGap: PrimaryGap;
  resultType: ResultType;
  seatRecommendation: SeatRecommendation;
}

export type ResultType =
  | "BUDGET_NO_SYSTEM"
  | "GAP_AUDIENCE"
  | "GAP_OFFER"
  | "GAP_TRUST"
  | "GAP_SALES_PATH"
  | "GAP_CONTROL"
  | "PREMIUM_REVIEW"
  | "INDIVIDUAL_DIAGNOSIS";

export type SeatRecommendation =
  | "STANDARD_SEAT"
  | "PREMIUM_REVIEW_SEAT"
  | "BUSINESS_TEAM_SEAT"
  | "MARKETING_MRI"
  | "DIAGNOSTIC_CALL";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function asArray(v: AnswerValue | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function asString(v: AnswerValue | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export function getBudgetUseLabel(score: number): string {
  if (score <= 30) return "სუსტი";
  if (score <= 60) return "ნაწილობრივი";
  if (score <= 80) return "კარგი";
  return "ძლიერი";
}

export function getSystemClarityLabel(score: number): string {
  if (score <= 30) return "ქაოსური";
  if (score <= 60) return "ნაწილობრივ დალაგებული";
  if (score <= 80) return "საკმაოდ დალაგებული";
  return "სისტემური";
}

export function getCourseFitLabel(score: number): string {
  if (score <= 30) return "ჯერ ადრეა";
  if (score <= 60) return "შეიძლება გამოგადგეს";
  if (score <= 80) return "კარგი შესაბამისობა";
  return "ძალიან მაღალი შესაბამისობა";
}

function determinePrimaryGap(answers: Answers): PrimaryGap {
  const gapWeights: Record<PrimaryGap, number> = {
    AUDIENCE: 0,
    OFFER: 0,
    TRUST: 0,
    SALES_PATH: 0,
    CONTROL: 0,
    TEAM_AGENCY: 0,
    LEARNING_PATH: 0,
    MRI_NEED: 0,
  };

  for (const question of quizQuestions) {
    const raw = answers[question.id];
    const selectedKeys = asArray(raw);

    for (const key of selectedKeys) {
      const option = question.options.find((o) => o.key === key);
      if (option?.gapSignal) {
        gapWeights[option.gapSignal.gap] += option.gapSignal.weight;
      }
    }
  }

  // Q12 multi-select: self-identified goals carry extra weight
  const q12 = asArray(answers["q12"]);
  for (const key of q12) {
    const option = quizQuestions
      .find((q) => q.id === "q12")
      ?.options.find((o) => o.key === key);
    if (option?.gapSignal) {
      gapWeights[option.gapSignal.gap] += option.gapSignal.weight;
    }
  }

  // Find gap with highest weight
  let topGap: PrimaryGap = "CONTROL";
  let topWeight = -1;
  for (const [gap, weight] of Object.entries(gapWeights) as [PrimaryGap, number][]) {
    if (weight > topWeight) {
      topWeight = weight;
      topGap = gap;
    }
  }

  return topGap;
}

function determineResultType(
  budgetUseScore: number,
  systemClarityScore: number,
  courseFitScore: number,
  primaryGap: PrimaryGap
): ResultType {
  // Special: budget is being spent but no system
  if (budgetUseScore >= 40 && systemClarityScore < 35) {
    return "BUDGET_NO_SYSTEM";
  }

  // High course fit + MRI_NEED → individual diagnosis
  if (primaryGap === "MRI_NEED" && courseFitScore >= 70) {
    return "INDIVIDUAL_DIAGNOSIS";
  }

  // TEAM_AGENCY with high fit → Premium Review
  if (primaryGap === "TEAM_AGENCY" && courseFitScore >= 65) {
    return "PREMIUM_REVIEW";
  }

  // LEARNING_PATH → surface as AUDIENCE (they need foundational help)
  if (primaryGap === "LEARNING_PATH") {
    return "GAP_AUDIENCE";
  }

  const gapToResult: Record<PrimaryGap, ResultType> = {
    AUDIENCE: "GAP_AUDIENCE",
    OFFER: "GAP_OFFER",
    TRUST: "GAP_TRUST",
    SALES_PATH: "GAP_SALES_PATH",
    CONTROL: "GAP_CONTROL",
    TEAM_AGENCY: "PREMIUM_REVIEW",
    LEARNING_PATH: "GAP_AUDIENCE",
    MRI_NEED: "INDIVIDUAL_DIAGNOSIS",
  };

  return gapToResult[primaryGap];
}

function determineSeatRecommendation(
  courseFitScore: number,
  answers: Answers
): SeatRecommendation {
  const q1 = asString(answers["q1"]);
  const q12 = asArray(answers["q12"]);

  const hasTeam = q1 === "B" || q1 === "D";
  const wantsReview = q12.includes("H") || q12.includes("F");
  const wantsMRI = q12.includes("H") && courseFitScore < 50;

  if (wantsMRI) return "MARKETING_MRI";
  if (courseFitScore < 35) return "DIAGNOSTIC_CALL";
  if (hasTeam) return "BUSINESS_TEAM_SEAT";
  if (wantsReview && courseFitScore >= 70) return "PREMIUM_REVIEW_SEAT";
  if (courseFitScore >= 61) return "STANDARD_SEAT";
  return "DIAGNOSTIC_CALL";
}

export function computeScore(answers: Answers): ScoreResult {
  let budgetUse = 40;
  let systemClarity = 10;
  let courseFit = 25;

  for (const question of quizQuestions) {
    const raw = answers[question.id];
    const selectedKeys = asArray(raw);

    for (const key of selectedKeys) {
      const option = question.options.find((o) => o.key === key);
      if (!option?.modifier) continue;
      const { modifier } = option;
      if (modifier.budgetUse) budgetUse += modifier.budgetUse;
      if (modifier.systemClarity) systemClarity += modifier.systemClarity;
      if (modifier.courseFit) courseFit += modifier.courseFit;
    }
  }

  budgetUse = clamp(budgetUse);
  systemClarity = clamp(systemClarity);
  courseFit = clamp(courseFit);

  const primaryGap = determinePrimaryGap(answers);
  const resultType = determineResultType(budgetUse, systemClarity, courseFit, primaryGap);
  const seatRecommendation = determineSeatRecommendation(courseFit, answers);

  return {
    budgetUseScore: budgetUse,
    systemClarityScore: systemClarity,
    courseFitScore: courseFit,
    budgetUseLabel: getBudgetUseLabel(budgetUse),
    systemClarityLabel: getSystemClarityLabel(systemClarity),
    courseFitLabel: getCourseFitLabel(courseFit),
    primaryGap,
    resultType,
    seatRecommendation,
  };
}
