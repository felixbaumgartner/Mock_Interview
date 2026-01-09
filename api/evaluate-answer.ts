import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { evaluateAnswerSchema } from './utils/validation';
import { checkRateLimit, getClientIdentifier } from './utils/rateLimit';
import { buildAnswerEvaluationPrompt } from '../src/prompts/answerEvaluation';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Rate limiting: 50 requests per hour per IP
    const clientId = getClientIdentifier(req as any);
    const rateLimit = checkRateLimit(clientId, 50, 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`,
      });
    }

    // Validate request body
    const validationResult = evaluateAnswerSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.errors,
      });
    }

    const { question, modelAnswer, userAnswer, resumeContext, jobDescContext } = validationResult.data;

    // Initialize Gemini client
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build prompt
    const prompt = buildAnswerEvaluationPrompt(
      question,
      modelAnswer,
      userAnswer,
      resumeContext
    );

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    let parsed;
    try {
      // Try to find JSON in the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('Failed to parse AI response');
    }

    // Validate response structure
    if (
      typeof parsed.score !== 'number' ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.areasForImprovement) ||
      !Array.isArray(parsed.suggestions) ||
      typeof parsed.detailedFeedback !== 'string'
    ) {
      throw new Error('Invalid response format from AI');
    }

    return res.status(200).json({
      success: true,
      data: {
        evaluation: {
          score: parsed.score,
          strengths: parsed.strengths,
          areasForImprovement: parsed.areasForImprovement,
          suggestions: parsed.suggestions,
          detailedFeedback: parsed.detailedFeedback,
        },
      },
    });
  } catch (error) {
    console.error('Answer evaluation error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to evaluate answer. Please try again.',
    });
  }
}
