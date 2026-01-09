import type { QuestionCount } from '@/types/interview';

export function buildQuestionGenerationPrompt(
  resumeText: string,
  jobDescText: string,
  questionCount: QuestionCount
): string {
  return `You are an expert technical interviewer and career coach. Your task is to generate ${questionCount} high-quality, relevant interview questions based on the candidate's resume and the job description provided.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescText}

REQUIREMENTS:
1. Generate exactly ${questionCount} questions
2. Mix question types according to these proportions:
   - 40% Technical/Domain-specific (based on skills in resume and job requirements)
   - 30% Behavioral (STAR method compatible - Situation, Task, Action, Result)
   - 20% Situational/Problem-solving
   - 10% Company/Role-specific
3. Difficulty distribution:
   - 30% Easy (warm-up, basic concepts)
   - 50% Medium (standard interview depth)
   - 20% Hard (challenging, senior-level thinking)
4. For each question, you must provide:
   - The question itself (clear and specific)
   - A comprehensive, high-quality model answer (200-300 words)
   - Question category (technical, behavioral, situational, or company-specific)
   - Difficulty level (easy, medium, or hard)

ANSWER QUALITY CRITERIA:
- Answers should be detailed, specific, and actionable
- Include relevant examples from the candidate's experience when possible
- Demonstrate best practices and industry standards
- Show clear structure (for behavioral questions: use STAR format)
- Include technical depth appropriate to the role
- Be conversational yet professional

IMPORTANT INSTRUCTIONS:
- Make questions highly relevant to BOTH the resume and job description
- Draw from specific technologies, projects, or experiences mentioned in the resume
- Align questions with the actual requirements and responsibilities in the job description
- Ensure questions test both depth of knowledge and practical application
- For behavioral questions, frame them around scenarios relevant to the target role

You MUST return ONLY valid JSON in this exact format (no other text before or after):
{
  "questions": [
    {
      "id": "unique-id-1",
      "question": "Your question here?",
      "modelAnswer": "A comprehensive 200-300 word answer that demonstrates best practices...",
      "category": "technical",
      "difficulty": "medium"
    }
  ]
}`;
}
