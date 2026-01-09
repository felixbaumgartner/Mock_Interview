import { z } from 'zod';

export const generateQuestionsSchema = z.object({
  resumeText: z.string().min(50).max(20000),
  jobDescriptionText: z.string().min(50).max(20000),
  questionCount: z.union([z.literal(5), z.literal(10), z.literal(15)]),
});

export const evaluateAnswerSchema = z.object({
  question: z.string().min(10).max(1000),
  modelAnswer: z.string().min(50).max(5000),
  userAnswer: z.string().min(10).max(5000),
  resumeContext: z.string().min(50).max(20000),
  jobDescContext: z.string().min(50).max(20000),
});

export type GenerateQuestionsInput = z.infer<typeof generateQuestionsSchema>;
export type EvaluateAnswerInput = z.infer<typeof evaluateAnswerSchema>;
