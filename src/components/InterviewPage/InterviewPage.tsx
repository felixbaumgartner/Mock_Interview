import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '@/stores/interviewStore';
import { QuestionCard } from './QuestionCard';
import { Button } from '../shared/Button';
import { generateInterviewPDF } from '@/utils/pdfExport';
import './InterviewPage.css';

export function InterviewPage() {
  const navigate = useNavigate();
  const {
    questions,
    userAnswers,
    revealedAnswers,
    evaluations,
    evaluatingQuestions,
    submitAnswer,
    revealAnswer,
    evaluateAnswer,
    reset,
  } = useInterviewStore();

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  useEffect(() => {
    // Redirect to upload page if no questions
    if (questions.length === 0) {
      navigate('/');
    }
  }, [questions, navigate]);

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      reset();
      navigate('/');
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await generateInterviewPDF(questions, userAnswers, evaluations);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const answeredCount = Array.from(userAnswers.values()).filter(a => a.length >= 10).length;
  const evaluatedCount = evaluations.size;

  return (
    <div className="interview-page">
      <div className="interview-page__container">
        <header className="interview-page__header">
          <div>
            <h1>Mock Interview Questions</h1>
            <p className="interview-page__stats">
              {answeredCount} of {questions.length} answered · {evaluatedCount} evaluated
            </p>
          </div>
          <div className="interview-page__header-actions">
            {answeredCount > 0 && (
              <Button
                variant="primary"
                size="small"
                onClick={handleExportPDF}
                isLoading={isExportingPDF}
              >
                Export PDF
              </Button>
            )}
            <Button
              variant="secondary"
              size="small"
              onClick={handleStartOver}
            >
              Start Over
            </Button>
          </div>
        </header>

        <div className="interview-page__questions">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              userAnswer={userAnswers.get(question.id)}
              evaluation={evaluations.get(question.id)}
              isRevealed={revealedAnswers.has(question.id)}
              isEvaluating={evaluatingQuestions.has(question.id)}
              onSubmitAnswer={(answer) => submitAnswer(question.id, answer)}
              onRevealAnswer={() => revealAnswer(question.id)}
              onEvaluate={() => evaluateAnswer(question.id)}
            />
          ))}
        </div>

        {answeredCount > 0 && (
          <div className="interview-page__footer">
            <p className="interview-page__footer-text">
              Great progress! You've answered {answeredCount} out of {questions.length} questions.
              {evaluatedCount < answeredCount && ' Submit your answers for AI evaluation!'}
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={handleExportPDF}
              isLoading={isExportingPDF}
            >
              Export Report as PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
