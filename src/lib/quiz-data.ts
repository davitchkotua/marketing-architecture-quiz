// Marketing Architecture Quiz — 12 diagnostic questions

export type PrimaryGap =
  | "AUDIENCE"
  | "OFFER"
  | "TRUST"
  | "SALES_PATH"
  | "CONTROL"
  | "TEAM_AGENCY"
  | "LEARNING_PATH"
  | "MRI_NEED";

export type QuestionType = "single" | "multi";

export interface GapSignal {
  gap: PrimaryGap;
  weight: number;
}

export interface ScoreModifier {
  budgetUse?: number;
  systemClarity?: number;
  courseFit?: number;
}

export interface QuizOption {
  key: string;
  label: string;
  modifier?: ScoreModifier;
  gapSignal?: GapSignal;
}

export interface QuizQuestion {
  id: string;
  number: number;
  title: string;
  helperText?: string;
  type: QuestionType;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  // Q1 — context: who manages marketing
  {
    id: "q1",
    number: 1,
    title: "ვინ/რა მართავს მარკეტინგს შენს ბიზნესში ამჟამად?",
    type: "single",
    options: [
      {
        key: "A",
        label: "მხოლოდ მე ვმართავ",
        modifier: { courseFit: 10 },
        gapSignal: { gap: "LEARNING_PATH", weight: 1 },
      },
      {
        key: "B",
        label: "გვყავს штатный მარკეტერი",
        modifier: { courseFit: 15 },
        gapSignal: { gap: "TEAM_AGENCY", weight: 2 },
      },
      {
        key: "C",
        label: "ვიყენებ სააგენტოს ან ფრილანსერს",
        modifier: { courseFit: 15 },
        gapSignal: { gap: "TEAM_AGENCY", weight: 2 },
      },
      {
        key: "D",
        label: "სხვადასხვა მომსახურება კომბინირებულად",
        modifier: { courseFit: 10 },
        gapSignal: { gap: "TEAM_AGENCY", weight: 1 },
      },
      {
        key: "E",
        label: "ჯერ არ ვმუშაობ მარკეტინგზე",
        modifier: { courseFit: 5, budgetUse: -15 },
        gapSignal: { gap: "LEARNING_PATH", weight: 3 },
      },
    ],
  },

  // Q2 — budget
  {
    id: "q2",
    number: 2,
    title: "თვეში მარკეტინგზე საშუალოდ რამდენს ხარჯავ?",
    type: "single",
    options: [
      {
        key: "A",
        label: "ჯერ არ გვაქვს ცალკე ბიუჯეტი",
        modifier: { budgetUse: -20, courseFit: -10 },
      },
      {
        key: "B",
        label: "500 ₾-ზე ნაკლები / თვე",
        modifier: { budgetUse: 0, courseFit: 5 },
      },
      {
        key: "C",
        label: "500–2,000 ₾ / თვე",
        modifier: { budgetUse: 8, courseFit: 10 },
      },
      {
        key: "D",
        label: "2,000–5,000 ₾ / თვე",
        modifier: { budgetUse: 14, courseFit: 15 },
      },
      {
        key: "E",
        label: "5,000–10,000 ₾ / თვე",
        modifier: { budgetUse: 18, courseFit: 18 },
      },
      {
        key: "F",
        label: "10,000+ ₾ / თვე",
        modifier: { budgetUse: 22, courseFit: 20 },
      },
    ],
  },

  // Q3 — audience clarity (AUDIENCE gap)
  {
    id: "q3",
    number: 3,
    title: "იცი, ვის ელაპარაკება შენი მარკეტინგი?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არა — ვსაუბრობთ ყველასთვის",
        modifier: { systemClarity: -20, budgetUse: -10, courseFit: 15 },
        gapSignal: { gap: "AUDIENCE", weight: 5 },
      },
      {
        key: "B",
        label: "ზოგადად ვხვდებით, კონკრეტულად — არა",
        modifier: { systemClarity: -8, budgetUse: -4, courseFit: 12 },
        gapSignal: { gap: "AUDIENCE", weight: 3 },
      },
      {
        key: "C",
        label: "გვყავს ზოგადი სამიზნე ჯგუფი",
        modifier: { systemClarity: 5, budgetUse: 3, courseFit: 8 },
        gapSignal: { gap: "AUDIENCE", weight: 1 },
      },
      {
        key: "D",
        label: "კარგად ვიცით — ვისთვისაა",
        modifier: { systemClarity: 15, budgetUse: 6 },
      },
      {
        key: "E",
        label: "ზუსტი პორტრეტი გვაქვს აღწერილი",
        modifier: { systemClarity: 22, budgetUse: 8 },
      },
    ],
  },

  // Q4 — offer clarity (OFFER gap)
  {
    id: "q4",
    number: 4,
    title: "გაქვს მკაფიო შეთავაზება — ვის ეხმარება, რა პრობლემას ხსნის და რატომ ჯობია?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არა — ზოგადად ვყიდით პროდუქტს ან სერვისს",
        modifier: { systemClarity: -20, courseFit: 15 },
        gapSignal: { gap: "OFFER", weight: 5 },
      },
      {
        key: "B",
        label: "ნაწილობრივ — ბოლომდე ჩამოყალიბებული არ გვაქვს",
        modifier: { systemClarity: -8, courseFit: 12 },
        gapSignal: { gap: "OFFER", weight: 3 },
      },
      {
        key: "C",
        label: "გვაქვს, მაგრამ ბაზარზე ბევრი მსგავსია",
        modifier: { systemClarity: 5, courseFit: 8 },
        gapSignal: { gap: "OFFER", weight: 1 },
      },
      {
        key: "D",
        label: "გვაქვს მკაფიო შეთავაზება",
        modifier: { systemClarity: 14 },
      },
      {
        key: "E",
        label: "გვაქვს, გამოვცადეთ და კარგად მუშაობს",
        modifier: { systemClarity: 20 },
      },
    ],
  },

  // Q5 — trust building (TRUST gap)
  {
    id: "q5",
    number: 5,
    title: "სანამ ახალი ადამიანი ყიდვას გადაწყვეტს, რამდენად ქმნის ნდობას შენი მარკეტინგი?",
    type: "single",
    options: [
      {
        key: "A",
        label: "სპეციალურად ამაზე არ ვმუშაობ",
        modifier: { systemClarity: -18, courseFit: 14 },
        gapSignal: { gap: "TRUST", weight: 5 },
      },
      {
        key: "B",
        label: "ძირითადად სოციალური მედია და რეკლამა",
        modifier: { systemClarity: -6, courseFit: 10 },
        gapSignal: { gap: "TRUST", weight: 2 },
      },
      {
        key: "C",
        label: "გვყავს გამოხმაურება, პორტფოლიო ან Case Study",
        modifier: { systemClarity: 8, courseFit: 6 },
      },
      {
        key: "D",
        label: "კონტენტი, გამოხმაურება და ნდობის შემქმნელი სისტემა",
        modifier: { systemClarity: 16 },
      },
      {
        key: "E",
        label: "ნდობის შექმნის ეტაპები გაყიდვამდე გზაში ჩაშენებულია",
        modifier: { systemClarity: 22 },
      },
    ],
  },

  // Q6 — sales path clarity (SALES_PATH gap)
  {
    id: "q6",
    number: 6,
    title: "მარკეტინგიდან ყიდვამდე — იცი ყველა ეტაპი, რომელსაც ახალი ადამიანი გადის?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არა",
        modifier: { systemClarity: -18, courseFit: 14 },
        gapSignal: { gap: "SALES_PATH", weight: 5 },
      },
      {
        key: "B",
        label: "ზოგადად ვხვდებით",
        modifier: { systemClarity: -6, courseFit: 10 },
        gapSignal: { gap: "SALES_PATH", weight: 3 },
      },
      {
        key: "C",
        label: "ნაწილობრივ გვაქვს გაწერილი",
        modifier: { systemClarity: 6, courseFit: 6 },
        gapSignal: { gap: "SALES_PATH", weight: 1 },
      },
      {
        key: "D",
        label: "ძირითადი ეტაპები განსაზღვრულია",
        modifier: { systemClarity: 14 },
      },
      {
        key: "E",
        label: "ყველა ეტაპი გაწერილია — ვიცით ვინ/რა პასუხობს",
        modifier: { systemClarity: 20 },
      },
    ],
  },

  // Q7 — leakage point (SALES_PATH signal)
  {
    id: "q7",
    number: 7,
    title: "ბოლო 3 თვეში — ადამიანი სად ჩერდება ყველაზე ხშირად?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არ ვაკვირდებით",
        modifier: { budgetUse: -12, systemClarity: -10, courseFit: 10 },
        gapSignal: { gap: "CONTROL", weight: 4 },
      },
      {
        key: "B",
        label: "სანამ გვიკავშირდება — რეკლამა ან კონტენტი არ მოქმედებს",
        modifier: { courseFit: 8 },
        gapSignal: { gap: "AUDIENCE", weight: 2 },
      },
      {
        key: "C",
        label: "გვიკავშირდება, მაგრამ გზაში ქრება",
        modifier: { courseFit: 8 },
        gapSignal: { gap: "SALES_PATH", weight: 3 },
      },
      {
        key: "D",
        label: "შეთავაზებამდე მდის, მაგრამ ყიდვა ბლოკდება",
        modifier: { courseFit: 8 },
        gapSignal: { gap: "OFFER", weight: 2 },
      },
      {
        key: "E",
        label: "ვაკვირდებით — ეტაპები გვყავს და ვიცით სად კარგავს",
        modifier: { systemClarity: 10, budgetUse: 6 },
      },
    ],
  },

  // Q8 — control sheet (CONTROL gap)
  {
    id: "q8",
    number: 8,
    title: "გდებს კვირეული ან თვიური Marketing Control Sheet — ყველა ძირითადი ციფრი ერთ ადგილზე?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არა",
        modifier: { budgetUse: -12, systemClarity: -8, courseFit: 18 },
        gapSignal: { gap: "CONTROL", weight: 5 },
      },
      {
        key: "B",
        label: "ზოგადი ინფო გვაქვს, ერთ ადგილს — არა",
        modifier: { budgetUse: -4, courseFit: 14 },
        gapSignal: { gap: "CONTROL", weight: 3 },
      },
      {
        key: "C",
        label: "ვაგროვებთ, მაგრამ არარეგულარულად",
        modifier: { budgetUse: 4, courseFit: 8 },
        gapSignal: { gap: "CONTROL", weight: 1 },
      },
      {
        key: "D",
        label: "გვაქვს — ვიყენებთ ზოგჯერ",
        modifier: { budgetUse: 12, systemClarity: 8, courseFit: 4 },
      },
      {
        key: "E",
        label: "გვაქვს — ყოველ კვირა ვიყენებთ გადაწყვეტილებების მისაღებად",
        modifier: { budgetUse: 20, systemClarity: 14 },
      },
    ],
  },

  // Q9 — team/agency management (TEAM_AGENCY gap)
  {
    id: "q9",
    number: 9,
    title: "თუ გყავს მარკეტერი ან სააგენტო — ზუსტად იცი, რა შედეგს ელოდები?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არ მყავს — მარკეტინგს თვითონ ვმართავ",
        modifier: { courseFit: 5 },
      },
      {
        key: "B",
        label: "მყავს, მაგრამ ზუსტი შედეგი განსაზღვრული არ გვაქვს",
        modifier: { courseFit: 18, budgetUse: -8 },
        gapSignal: { gap: "TEAM_AGENCY", weight: 5 },
      },
      {
        key: "C",
        label: "ნაწილობრივ — რაღაც ვითხოვ, შედეგი ბუნდოვანია",
        modifier: { courseFit: 14, budgetUse: -4 },
        gapSignal: { gap: "TEAM_AGENCY", weight: 3 },
      },
      {
        key: "D",
        label: "ვიცი, მაგრამ ვერ ვზომავ",
        modifier: { courseFit: 8 },
        gapSignal: { gap: "CONTROL", weight: 2 },
      },
      {
        key: "E",
        label: "ვიცი, ვითხოვ კონკრეტულ რეპორტს და ვზომავ",
        modifier: { budgetUse: 8, systemClarity: 8 },
      },
    ],
  },

  // Q10 — strategy review frequency (LEARNING_PATH / CONTROL)
  {
    id: "q10",
    number: 10,
    title: "ბოლოს, როდის გადახედე მარკეტინგის სტრატეგიას?",
    type: "single",
    options: [
      {
        key: "A",
        label: "არ მახსოვს — ან არასდროს",
        modifier: { systemClarity: -10, courseFit: 12 },
        gapSignal: { gap: "LEARNING_PATH", weight: 5 },
      },
      {
        key: "B",
        label: "1 წელზე მეტი წინ",
        modifier: { systemClarity: -4, courseFit: 10 },
        gapSignal: { gap: "LEARNING_PATH", weight: 3 },
      },
      {
        key: "C",
        label: "3–12 თვის წინ",
        modifier: { systemClarity: 4, courseFit: 6 },
      },
      {
        key: "D",
        label: "ბოლო 3 თვეში",
        modifier: { systemClarity: 10, courseFit: 2 },
      },
      {
        key: "E",
        label: "რეგულარულად ვახლებ",
        modifier: { systemClarity: 16, budgetUse: 6 },
      },
    ],
  },

  // Q11 — connected to sales figures (CONTROL gap)
  {
    id: "q11",
    number: 11,
    title: "შენი მარკეტინგი მიკავშირებულია გაყიდვის ფაქტობრივ ციფრებს?",
    type: "single",
    options: [
      {
        key: "A",
        label: "კავშირი არ ჩანს",
        modifier: { budgetUse: -14, systemClarity: -8, courseFit: 16 },
        gapSignal: { gap: "CONTROL", weight: 5 },
      },
      {
        key: "B",
        label: "ზოგადად ვხვდებით — ზუსტი კავშირი არ ჩანს",
        modifier: { budgetUse: -4, courseFit: 10 },
        gapSignal: { gap: "CONTROL", weight: 3 },
      },
      {
        key: "C",
        label: "ნაწილობრივ ვზომავთ",
        modifier: { budgetUse: 6, courseFit: 6 },
      },
      {
        key: "D",
        label: "კარგად ვზომავთ",
        modifier: { budgetUse: 16, systemClarity: 10 },
      },
      {
        key: "E",
        label: "ყველა ქმედება დაკავშირებულია გაყიდვის მეტრიკასთან",
        modifier: { budgetUse: 24, systemClarity: 16 },
      },
    ],
  },

  // Q12 — self-identified goals (multi, feeds primaryGap + courseFit)
  {
    id: "q12",
    number: 12,
    title: "რა გინდა, რომ გაიგო ამ ქვიზის შემდეგ? მონიშნე ყველა შესაბამისი.",
    helperText: "შეგიძლია რამდენიმე პასუხი მონიშნო.",
    type: "multi",
    options: [
      {
        key: "A",
        label: "გავიგო, ვის ველაპარაკებ",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "AUDIENCE", weight: 4 },
      },
      {
        key: "B",
        label: "ვიპოვო, რა განასხვავებს ჩვენს შეთავაზებას",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "OFFER", weight: 4 },
      },
      {
        key: "C",
        label: "ნდობა შევქმნა ახალ ადამიანებში",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "TRUST", weight: 4 },
      },
      {
        key: "D",
        label: "გავიგო, სად ჩერდება ადამიანი ყიდვამდე",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "SALES_PATH", weight: 4 },
      },
      {
        key: "E",
        label: "ვიცოდე, რას ვზომავ — შედეგი დავინახო",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "CONTROL", weight: 4 },
      },
      {
        key: "F",
        label: "სწორად ვმართო მარკეტერი ან სააგენტო",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "TEAM_AGENCY", weight: 4 },
      },
      {
        key: "G",
        label: "ვიცოდე, სად დავიწყო სისტემის აწყობა",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "LEARNING_PATH", weight: 4 },
      },
      {
        key: "H",
        label: "ყველაფერი ერთ სამუშაო სისტემაში ჩავსვა",
        modifier: { courseFit: 2 },
        gapSignal: { gap: "MRI_NEED", weight: 4 },
      },
    ],
  },
];

export const marketingBudgetRanges = [
  "ჯერ არ გვაქვს ცალკე ბიუჯეტი",
  "500 ₾-ზე ნაკლები / თვე",
  "500–2,000 ₾ / თვე",
  "2,000–5,000 ₾ / თვე",
  "5,000–10,000 ₾ / თვე",
  "10,000+ ₾ / თვე",
];

export const teamSizeRanges = [
  "მხოლოდ მე",
  "2–5",
  "6–15",
  "16–50",
  "50+",
];
