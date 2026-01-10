// Local development API server for Claude/Anthropic
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AnthropicSDK from '@anthropic-ai/sdk';

dotenv.config();

const Anthropic = AnthropicSDK.default || AnthropicSDK;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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

// Answer evaluation prompt builder
function buildAnswerEvaluationPrompt(question, modelAnswer, userAnswer, resumeContext) {
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
      model: 'claude-3-5-sonnet-20241022',
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

    const prompt = buildAnswerEvaluationPrompt(
      question,
      modelAnswer,
      userAnswer,
      resumeContext
    );

    console.log('🤖 Evaluating answer with Claude...');
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.5,
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
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*\n`);
});
