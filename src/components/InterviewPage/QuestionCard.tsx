import type { Question, Evaluation } from '@/types/interview';
import { PracticeAnswerInput } from './PracticeAnswerInput';
import { ModelAnswerDisplay } from './ModelAnswerDisplay';
import { EvaluationDisplay } from './EvaluationDisplay';
import { Button } from '../shared/Button';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  index: number;
  userAnswer?: string;
  evaluation?: Evaluation;
  isRevealed: boolean;
  isEvaluating: boolean;
  onSubmitAnswer: (answer: string) => void;
  onRevealAnswer: () => void;
  onEvaluate: () => void;
}

export function QuestionCard({
  question,
  index,
  userAnswer,
  evaluation,
  isRevealed,
  isEvaluating,
  onSubmitAnswer,
  onRevealAnswer,
  onEvaluate,
}: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'question-card__badge--easy';
      case 'medium':
        return 'question-card__badge--medium';
      case 'hard':
        return 'question-card__badge--hard';
      default:
        return '';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'technical':
        return 'Technical';
      case 'behavioral':
        return 'Behavioral';
      case 'situational':
        return 'Situational';
      case 'company-specific':
        return 'Company-Specific';
      default:
        return category;
    }
  };

  return (
    <div className="question-card">
      <div className="question-card__header">
        <div>
          <h3 className="question-card__number">Question {index + 1}</h3>
          <div className="question-card__badges">
            <span className="question-card__badge question-card__badge--category">
              {getCategoryLabel(question.category)}
            </span>
            <span className={`question-card__badge ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
        </div>
      </div>

      <p className="question-card__question">{question.question}</p>

      <div className="question-card__content">
        <PracticeAnswerInput
          questionId={question.id}
          onSubmit={onSubmitAnswer}
          initialValue={userAnswer}
        />

        <div className="question-card__actions">
          {!isRevealed && (
            <Button
              variant="outline"
              size="small"
              onClick={onRevealAnswer}
            >
              Reveal Model Answer
            </Button>
          )}

          {userAnswer && userAnswer.length >= 10 && (
            <Button
              variant="primary"
              size="small"
              onClick={onEvaluate}
              isLoading={isEvaluating}
              disabled={isEvaluating}
            >
              {evaluation ? 'Re-evaluate Answer' : 'Submit for Evaluation'}
            </Button>
          )}
        </div>

        {isRevealed && <ModelAnswerDisplay answer={question.modelAnswer} />}

        {evaluation && <EvaluationDisplay evaluation={evaluation} />}
      </div>
    </div>
  );
}
