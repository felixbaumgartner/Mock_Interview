import ReactMarkdown from 'react-markdown';
import './ModelAnswerDisplay.css';

interface ModelAnswerDisplayProps {
  answer: string;
}

export function ModelAnswerDisplay({ answer }: ModelAnswerDisplayProps) {
  return (
    <div className="model-answer">
      <h4 className="model-answer__title">Model Answer</h4>
      <div className="model-answer__content">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
}
