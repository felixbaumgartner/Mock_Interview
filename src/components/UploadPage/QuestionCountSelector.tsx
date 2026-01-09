import type { QuestionCount } from '@/types/interview';
import './QuestionCountSelector.css';

interface QuestionCountSelectorProps {
  value: QuestionCount;
  onChange: (count: QuestionCount) => void;
}

export function QuestionCountSelector({
  value,
  onChange,
}: QuestionCountSelectorProps) {
  const options: QuestionCount[] = [5, 10, 15];

  return (
    <div className="question-count-selector">
      <label className="question-count-selector__label">
        Number of Questions
      </label>
      <div className="question-count-selector__options">
        {options.map((count) => (
          <button
            key={count}
            className={`question-count-selector__option ${
              value === count ? 'question-count-selector__option--selected' : ''
            }`}
            onClick={() => onChange(count)}
            type="button"
          >
            {count}
          </button>
        ))}
      </div>
      <p className="question-count-selector__help">
        Choose how many interview questions you'd like to practice
      </p>
    </div>
  );
}
