export type QuestionCategory = 'technical' | 'behavioral' | 'situational' | 'company-specific';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionCount = 5 | 10 | 15;

export interface Question {
  id: string;
  question: string;
  modelAnswer: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
}

export interface Evaluation {
  score: number; // 0-100
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export interface GenerateQuestionsRequest {
  resumeText: string;
  jobDescriptionText: string;
  questionCount: QuestionCount;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  data?: {
    questions: Question[];
  };
  error?: string;
}

export interface EvaluateAnswerRequest {
  question: string;
  modelAnswer: string;
  userAnswer: string;
  resumeContext: string;
  jobDescContext: string;
}

export interface EvaluateAnswerResponse {
  success: boolean;
  data?: {
    evaluation: Evaluation;
  };
  error?: string;
}
