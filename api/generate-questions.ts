import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateQuestionsSchema } from './utils/validation';
import { checkRateLimit, getClientIdentifier } from './utils/rateLimit';
import { buildQuestionGenerationPrompt } from '../src/prompts/questionGeneration';

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
    // Rate limiting: 10 requests per hour per IP
    const clientId = getClientIdentifier(req as any);
    const rateLimit = checkRateLimit(clientId, 10, 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`,
      });
    }

    // Validate request body
    const validationResult = generateQuestionsSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationResult.error.errors,
      });
    }

    const { resumeText, jobDescriptionText, questionCount } = validationResult.data;

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
    const prompt = buildQuestionGenerationPrompt(
      resumeText,
      jobDescriptionText,
      questionCount
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
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure all questions have required fields
    const validQuestions = parsed.questions.filter((q: any) =>
      q.id && q.question && q.modelAnswer && q.category && q.difficulty
    );

    if (validQuestions.length !== questionCount) {
      console.warn(`Expected ${questionCount} questions, got ${validQuestions.length}`);
    }

    return res.status(200).json({
      success: true,
      data: {
        questions: validQuestions,
      },
    });
  } catch (error) {
    console.error('Question generation error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate questions. Please try again.',
    });
  }
}
