import { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import './PracticeAnswerInput.css';

interface PracticeAnswerInputProps {
  questionId?: string;
  onSubmit: (answer: string) => void;
  initialValue?: string;
}

export function PracticeAnswerInput({
  onSubmit,
  initialValue = '',
}: PracticeAnswerInputProps) {
  const [answer, setAnswer] = useState(initialValue);

  useEffect(() => {
    setAnswer(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    if (answer.trim().length >= 10) {
      onSubmit(answer);
    }
  };

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="practice-answer">
      <label className="practice-answer__label">Your Answer</label>
      <textarea
        className="practice-answer__textarea"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here... Aim for 150-250 words for a comprehensive response."
        rows={8}
      />
      <div className="practice-answer__footer">
        <span className="practice-answer__count">
          {wordCount} words ({answer.length} characters)
        </span>
        <Button
          variant="primary"
          size="small"
          onClick={handleSubmit}
          disabled={answer.trim().length < 10}
        >
          Save Answer
        </Button>
      </div>
    </div>
  );
}
