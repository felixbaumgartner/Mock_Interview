import { useState } from 'react';
import { validateTextLength } from '@/utils/validation';
import './TextAreaInput.css';

interface TextAreaInputProps {
  label: string;
  placeholder: string;
  onTextChange: (text: string) => void;
}

export function TextAreaInput({
  label,
  placeholder,
  onTextChange,
}: TextAreaInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    if (value.length > 0) {
      const validation = validateTextLength(value);
      if (!validation.valid) {
        setError(validation.error || 'Invalid text length');
      } else {
        setError(null);
        onTextChange(value);
      }
    } else {
      setError(null);
    }
  };

  return (
    <div className="textarea-input">
      <label className="textarea-input__label">{label}</label>
      <textarea
        className={`textarea-input__field ${
          error ? 'textarea-input__field--error' : ''
        }`}
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        rows={8}
      />
      {error && <p className="textarea-input__error">{error}</p>}
      <p className="textarea-input__help">
        {text.length} / 20,000 characters (min: 50)
      </p>
    </div>
  );
}
