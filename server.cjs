// Local development API server for Claude/Anthropic (CommonJS)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

const PORT = 3002;

// Question generation prompt builder
function buildQuestionGenerationPrompt(resumeText, jobDescText, questionCount) {
  return `You are an expert technical interviewer and career coach. Your task is to generate ${questionCount} high-quality, relevant interview questions based on the candidate's resume and the job description provided.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescText}

REQUIREMENTS:
1. Generate exactly ${questionCount} questions
2. Mix question types according to these proportions:
   - 40% Technical/Domain-specific
   - 30% Behavioral (STAR method compatible)
   - 20% Situational/Problem-solving
   - 10% Company/Role-specific

You MUST return ONLY valid JSON in this exact format (no other text):
{
  "questions": [
    {
      "id": "unique-id-1",
      "question": "Your question here?",
      "modelAnswer": "A comprehensive 200-300 word answer...",
      "category": "technical",
      "difficulty": "medium"
    }
  ]
}`;
}

// Generate questions endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText, questionCount } = req.body;

    if (!resumeText || !jobDescriptionText || !questionCount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY not set');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
    }

    const client = new Anthropic({ apiKey });

    const prompt = buildQuestionGenerationPrompt(
      resumeText,
      jobDescriptionText,
      questionCount
    );

    console.log('🤖 Generating questions with Claude...');
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000 * questionCount,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;
    const parsed = JSON.parse(jsonString);

    console.log(`✅ Successfully generated ${parsed.questions?.length || 0} questions`);

    return res.json({
      success: true,
      data: {
        questions: parsed.questions || [],
      },
    });
  } catch (error) {
    console.error('❌ Generate questions error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate questions',
    });
  }
});

// Evaluate answer endpoint
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, modelAnswer, userAnswer, resumeContext } = req.body;

    if (!question || !modelAnswer || !userAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY not set');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
    }

    const client = new Anthropic({ apiKey });

    console.log('🤖 Evaluating answer with Claude...');
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      temperature: 0.5,
      messages: [
        {
          role: 'user',
          content: `Evaluate this answer and return JSON with score, strengths, areasForImprovement, suggestions, and detailedFeedback.

Question: ${question}
Answer: ${userAnswer}`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;
    const parsed = JSON.parse(jsonString);

    console.log(`✅ Answer evaluated with score: ${parsed.score}`);

    return res.json({
      success: true,
      data: {
        evaluation: parsed,
      },
    });
  } catch (error) {
    console.error('❌ Evaluate answer error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate answer',
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Claude API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available\n`);
});
