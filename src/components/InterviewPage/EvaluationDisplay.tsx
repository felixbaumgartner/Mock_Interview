import type { Evaluation } from '@/types/interview';
import './EvaluationDisplay.css';

interface EvaluationDisplayProps {
  evaluation: Evaluation;
}

export function EvaluationDisplay({ evaluation }: EvaluationDisplayProps) {
  const { score, strengths, areasForImprovement, suggestions, detailedFeedback } = evaluation;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'evaluation__score--good';
    if (score >= 60) return 'evaluation__score--medium';
    return 'evaluation__score--low';
  };

  return (
    <div className="evaluation">
      <div className="evaluation__header">
        <h4 className="evaluation__title">AI Evaluation</h4>
        <div className={`evaluation__score ${getScoreColor(score)}`}>
          {score}/100
        </div>
      </div>

      <div className="evaluation__feedback">
        <p>{detailedFeedback}</p>
      </div>

      {strengths.length > 0 && (
        <div className="evaluation__section evaluation__section--strengths">
          <h5>Strengths</h5>
          <ul>
            {strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {areasForImprovement.length > 0 && (
        <div className="evaluation__section evaluation__section--improvements">
          <h5>Areas for Improvement</h5>
          <ul>
            {areasForImprovement.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="evaluation__section evaluation__section--suggestions">
          <h5>Suggestions</h5>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
