import { z } from "zod";

export const submissionSchema = z.object({
  // Quiz answers: each value is a string (single) or string[] (multi)
  answers: z.record(z.union([z.string(), z.array(z.string())])),

  // Lead form — required
  name: z.string().min(1, "სახელი სავალდებულოა"),
  email: z.string().email("ელფოსტა არასწორი ფორმატისაა"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "გთხოვ, დაეთანხმე პირობებს" }),
  }),

  // Lead form — optional
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  website: z.string().optional(),
  marketingBudgetRange: z.string().optional(),
  teamSize: z.string().optional(),

  // UTM tracking
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
      utm_term: z.string().optional(),
    })
    .optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
