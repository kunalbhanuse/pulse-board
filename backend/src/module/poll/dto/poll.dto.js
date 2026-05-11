import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().trim().min(1),
  options: z
    .array(
      z.object({
        text: z.string().trim().min(1),
      }),
    )
    .min(2),
});

export const pollSchema = z.object({
  title: z.string().trim().min(5).max(50),
  description: z.string().trim().min(15).max(200),
  expiresAt: z.number().min(1).max(30),
  requiresAuth: z.boolean(),
  questions: z.array(questionSchema).min(1),
});
