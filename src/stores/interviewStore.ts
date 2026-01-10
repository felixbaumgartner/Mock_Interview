import { create } from 'zustand';
import type { Question, Evaluation, QuestionCount } from '@/types/interview';
import { callAPI } from '@/utils/apiClient';
import type { GenerateQuestionsResponse, EvaluateAnswerResponse } from '@/types/interview';
import { generateMockQuestions, generateMockEvaluation } from '@/utils/mockData';

// Set to true to use mock data (no API key needed)
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

interface InterviewState {
  // Upload state
  resumeText: string | null;
  jobDescText: string | null;

  // Configuration
  questionCount: QuestionCount;

  // Generated content
  questions: Question[];
  isGenerating: boolean;
  generationError: string | null;

  // Practice state
  userAnswers: Map<string, string>;
  revealedAnswers: Set<string>;
  evaluations: Map<string, Evaluation>;
  evaluatingQuestions: Set<string>;

  // Actions
  setResumeText: (text: string) => void;
  setJobDescText: (text: string) => void;
  setQuestionCount: (count: QuestionCount) => void;
  generateQuestions: () => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => void;
  revealAnswer: (questionId: string) => void;
  evaluateAnswer: (questionId: string) => Promise<void>;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  // Initial state
  resumeText: null,
  jobDescText: null,
  questionCount: 10,
  questions: [],
  isGenerating: false,
  generationError: null,
  userAnswers: new Map(),
  revealedAnswers: new Set(),
  evaluations: new Map(),
  evaluatingQuestions: new Set(),

  // Actions
  setResumeText: (text: string) => set({ resumeText: text }),

  setJobDescText: (text: string) => set({ jobDescText: text }),

  setQuestionCount: (count: QuestionCount) => set({ questionCount: count }),

  generateQuestions: async () => {
    const { resumeText, jobDescText, questionCount } = get();

    if (!resumeText || !jobDescText) {
      set({ generationError: 'Please provide both resume and job description' });
      return;
    }

    set({ isGenerating: true, generationError: null, questions: [] });

    try {
      if (USE_MOCK_DATA) {
        // Use mock data for testing
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        const mockQuestions = generateMockQuestions(questionCount);
        set({
          questions: mockQuestions,
          isGenerating: false,
        });
      } else {
        // Use real API
        const response = await callAPI<GenerateQuestionsResponse>('/generate-questions', {
          method: 'POST',
          body: JSON.stringify({
            resumeText,
            jobDescriptionText: jobDescText,
            questionCount,
          }),
        });

        if (response.success && response.data) {
          set({
            questions: response.data.questions,
            isGenerating: false,
          });
        } else {
          throw new Error(response.error || 'Failed to generate questions');
        }
      }
    } catch (error) {
      set({
        isGenerating: false,
        generationError: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  },

  submitAnswer: (questionId: string, answer: string) => {
    const { userAnswers } = get();
    const newAnswers = new Map(userAnswers);
    newAnswers.set(questionId, answer);
    set({ userAnswers: newAnswers });
  },

  revealAnswer: (questionId: string) => {
    const { revealedAnswers } = get();
    const newRevealed = new Set(revealedAnswers);
    newRevealed.add(questionId);
    set({ revealedAnswers: newRevealed });
  },

  evaluateAnswer: async (questionId: string) => {
    const { questions, userAnswers, resumeText, jobDescText, evaluatingQuestions, evaluations } = get();

    const question = questions.find(q => q.id === questionId);
    const userAnswer = userAnswers.get(questionId);

    if (!question || !userAnswer || !resumeText || !jobDescText) {
      return;
    }

    // Add to evaluating set
    const newEvaluating = new Set(evaluatingQuestions);
    newEvaluating.add(questionId);
    set({ evaluatingQuestions: newEvaluating });

    try {
      if (USE_MOCK_DATA) {
        // Use mock evaluation
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        const mockEvaluation = generateMockEvaluation(userAnswer);
        const newEvaluations = new Map(evaluations);
        newEvaluations.set(questionId, mockEvaluation);
        set({ evaluations: newEvaluations });
      } else {
        // Use real API
        const response = await callAPI<EvaluateAnswerResponse>('/evaluate-answer', {
          method: 'POST',
          body: JSON.stringify({
            question: question.question,
            modelAnswer: question.modelAnswer,
            userAnswer,
            resumeContext: resumeText,
            jobDescContext: jobDescText,
          }),
        });

        if (response.success && response.data) {
          const newEvaluations = new Map(evaluations);
          newEvaluations.set(questionId, response.data.evaluation);
          set({ evaluations: newEvaluations });
        }
      }
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      const finalEvaluating = new Set(evaluatingQuestions);
      finalEvaluating.delete(questionId);
      set({ evaluatingQuestions: finalEvaluating });
    }
  },

  reset: () => set({
    resumeText: null,
    jobDescText: null,
    questionCount: 10,
    questions: [],
    isGenerating: false,
    generationError: null,
    userAnswers: new Map(),
    revealedAnswers: new Set(),
    evaluations: new Map(),
    evaluatingQuestions: new Set(),
  }),
}));
