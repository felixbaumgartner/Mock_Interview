export function buildAnswerEvaluationPrompt(
  question: string,
  modelAnswer: string,
  userAnswer: string,
  resumeContext: string
): string {
  return `You are an expert interview coach evaluating a candidate's answer to an interview question.

INTERVIEW QUESTION:
${question}

MODEL ANSWER (for reference):
${modelAnswer}

CANDIDATE'S ANSWER:
${userAnswer}

CANDIDATE'S BACKGROUND:
${resumeContext}

Your task is to evaluate the candidate's answer on the following criteria:
1. **Completeness**: Does it address all aspects of the question? Are key points covered?
2. **Clarity**: Is it well-structured and easy to follow? Is the communication clear?
3. **Relevance**: Does it stay on topic and use appropriate examples?
4. **Depth**: Does it show sufficient understanding and detail? Is there substance beyond surface-level responses?
5. **Professional Communication**: Is it articulate and professional in tone?

Please provide a comprehensive evaluation with:
1. **Overall score** (0-100):
   - 90-100: Excellent answer, exceeds expectations
   - 75-89: Good answer, meets expectations well
   - 60-74: Adequate answer, meets minimum expectations
   - 40-59: Below expectations, significant gaps
   - 0-39: Poor answer, does not meet expectations

2. **2-3 specific strengths**: What did the candidate do well? Be specific with examples from their answer.

3. **2-3 areas for improvement**: What could be better? Be constructive and specific.

4. **2-3 actionable suggestions**: Concrete advice on how to improve this answer or similar answers in the future.

5. **Detailed feedback paragraph** (100-150 words): A comprehensive evaluation that synthesizes the above points, provides context, and offers encouragement while being honest about areas for growth.

EVALUATION GUIDELINES:
- Be fair and balanced - acknowledge both strengths and weaknesses
- Be specific - reference actual parts of their answer
- Be constructive - frame criticism helpfully
- Consider the candidate's background from their resume when evaluating
- Don't expect perfection - evaluate based on realistic interview standards
- If the answer is very brief or incomplete, reflect that in the score but still provide helpful feedback

You MUST return ONLY valid JSON in this exact format (no other text before or after):
{
  "score": 85,
  "strengths": [
    "First specific strength with example from answer",
    "Second specific strength with example from answer"
  ],
  "areasForImprovement": [
    "First area for improvement with specific explanation",
    "Second area for improvement with specific explanation"
  ],
  "suggestions": [
    "First actionable suggestion for improvement",
    "Second actionable suggestion for improvement"
  ],
  "detailedFeedback": "A comprehensive 100-150 word paragraph that synthesizes the evaluation, provides context, and offers both encouragement and constructive criticism..."
}`;
}
