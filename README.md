# Mock Interview Prep - AI-Powered Interview Practice

An AI-powered web application that helps students prepare for job interviews by generating personalized interview questions based on their resume and target job description. Features comprehensive model answers, practice mode, and AI-powered evaluation.

## Features

- **Smart Document Upload**: Upload resume and job description as PDF, DOCX, or paste text directly
- **AI-Generated Questions**: Get 5, 10, or 15 personalized interview questions using Anthropic Claude
  - 40% Technical questions based on your skills
  - 30% Behavioral questions (STAR method compatible)
  - 20% Situational/Problem-solving questions
  - 10% Company/Role-specific questions
- **Practice Mode**: Type your answers before viewing model answers
- **AI Evaluation**: Get detailed feedback on your answers including:
  - Score (0-100)
  - Specific strengths
  - Areas for improvement
  - Actionable suggestions
  - Comprehensive feedback
- **PDF Export**: Download your questions, answers, and evaluations as a formatted PDF
- **Single-Use Sessions**: No account required, immediate access

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Zustand (state management)
- React Router
- React Dropzone (file upload)
- React Markdown (rendering)
- PDF.js (PDF parsing)
- Mammoth (DOCX parsing)
- jsPDF (PDF generation)

### Backend
- Vercel Serverless Functions
- Anthropic Claude API (3.5 Sonnet)
- Zod (validation)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Mock_Interview
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
VITE_API_BASE_URL=/api
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key

4. Your app will be live at your Vercel URL!

## Project Structure

```
Mock_Interview/
├── src/
│   ├── components/
│   │   ├── shared/           # Reusable components
│   │   ├── UploadPage/       # Document upload & configuration
│   │   └── InterviewPage/    # Interview questions & practice
│   ├── stores/
│   │   └── interviewStore.ts # Zustand state management
│   ├── utils/
│   │   ├── apiClient.ts      # API communication
│   │   ├── documentParser.ts # PDF/DOCX parsing
│   │   ├── pdfExport.ts      # PDF generation
│   │   └── validation.ts     # Input validation
│   ├── types/
│   │   └── interview.ts      # TypeScript types
│   ├── prompts/
│   │   ├── questionGeneration.ts
│   │   └── answerEvaluation.ts
│   ├── App.tsx
│   └── main.tsx
├── api/
│   ├── generate-questions.ts # Question generation endpoint
│   ├── evaluate-answer.ts    # Answer evaluation endpoint
│   └── utils/
│       ├── rateLimit.ts      # Rate limiting logic
│       └── validation.ts     # Server-side validation
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

## Usage

1. **Upload Documents**
   - Upload your resume (PDF/DOCX) or paste text
   - Upload job description (PDF/DOCX) or paste text
   - Select number of questions (5, 10, or 15)

2. **Generate Questions**
   - Click "Generate Interview Questions"
   - Wait 20-40 seconds for AI to generate questions

3. **Practice**
   - Read each question
   - Type your answer (aim for 150-250 words)
   - Click "Reveal Model Answer" to see the ideal response
   - Click "Submit for Evaluation" to get AI feedback

4. **Export**
   - Click "Export Report as PDF" to download your practice session
   - PDF includes questions, your answers, evaluations, and model answers

## API Endpoints

### POST /api/generate-questions
Generate interview questions based on resume and job description.

**Request:**
```json
{
  "resumeText": "string",
  "jobDescriptionText": "string",
  "questionCount": 5 | 10 | 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "uuid",
        "question": "string",
        "modelAnswer": "string",
        "category": "technical|behavioral|situational|company-specific",
        "difficulty": "easy|medium|hard"
      }
    ]
  }
}
```

### POST /api/evaluate-answer
Evaluate a candidate's answer to an interview question.

**Request:**
```json
{
  "question": "string",
  "modelAnswer": "string",
  "userAnswer": "string",
  "resumeContext": "string",
  "jobDescContext": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "score": 85,
      "strengths": ["string"],
      "areasForImprovement": ["string"],
      "suggestions": ["string"],
      "detailedFeedback": "string"
    }
  }
}
```

## Rate Limits

- **Question Generation**: 10 requests per IP per hour
- **Answer Evaluation**: 50 requests per IP per hour

## Cost Estimates

Per complete session (10 questions, all evaluated):
- Question generation: ~$0.027
- Answer evaluation: ~$0.040
- **Total: ~$0.067 per session**

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Accessibility

This application follows WCAG 2.1 AA guidelines:
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatible
- Color contrast compliance

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Anthropic Claude](https://www.anthropic.com) for AI capabilities
- [Vercel](https://vercel.com) for hosting platform
- [Vite](https://vitejs.dev) for build tooling

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ for students preparing for their dream jobs
