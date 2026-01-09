import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '@/stores/interviewStore';
import { FileUploader } from './FileUploader';
import { TextAreaInput } from './TextAreaInput';
import { QuestionCountSelector } from './QuestionCountSelector';
import { Button } from '../shared/Button';
import './UploadPage.css';

export function UploadPage() {
  const navigate = useNavigate();
  const {
    resumeText,
    jobDescText,
    questionCount,
    isGenerating,
    generationError,
    setResumeText,
    setJobDescText,
    setQuestionCount,
    generateQuestions,
  } = useInterviewStore();

  const [useResumeFile, setUseResumeFile] = useState(true);
  const [useJobDescFile, setUseJobDescFile] = useState(false);

  const canGenerate = resumeText && jobDescText && !isGenerating;

  const handleGenerate = async () => {
    await generateQuestions();
    if (!generationError) {
      navigate('/interview');
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-page__container">
        <header className="upload-page__header">
          <h1>AI Mock Interview Prep</h1>
          <p>
            Upload your resume and job description to generate personalized
            interview questions with AI-powered evaluation
          </p>
        </header>

        <div className="upload-page__section">
          <div className="upload-page__section-header">
            <h2>1. Resume</h2>
            <div className="upload-page__toggle">
              <button
                className={`upload-page__toggle-btn ${
                  useResumeFile ? 'upload-page__toggle-btn--active' : ''
                }`}
                onClick={() => setUseResumeFile(true)}
              >
                Upload File
              </button>
              <button
                className={`upload-page__toggle-btn ${
                  !useResumeFile ? 'upload-page__toggle-btn--active' : ''
                }`}
                onClick={() => setUseResumeFile(false)}
              >
                Paste Text
              </button>
            </div>
          </div>

          {useResumeFile ? (
            <FileUploader
              label="Upload Resume"
              onTextExtracted={setResumeText}
            />
          ) : (
            <TextAreaInput
              label="Paste Resume Text"
              placeholder="Paste your resume content here..."
              onTextChange={setResumeText}
            />
          )}
        </div>

        <div className="upload-page__section">
          <div className="upload-page__section-header">
            <h2>2. Job Description</h2>
            <div className="upload-page__toggle">
              <button
                className={`upload-page__toggle-btn ${
                  useJobDescFile ? 'upload-page__toggle-btn--active' : ''
                }`}
                onClick={() => setUseJobDescFile(true)}
              >
                Upload File
              </button>
              <button
                className={`upload-page__toggle-btn ${
                  !useJobDescFile ? 'upload-page__toggle-btn--active' : ''
                }`}
                onClick={() => setUseJobDescFile(false)}
              >
                Paste Text
              </button>
            </div>
          </div>

          {useJobDescFile ? (
            <FileUploader
              label="Upload Job Description"
              onTextExtracted={setJobDescText}
            />
          ) : (
            <TextAreaInput
              label="Paste Job Description"
              placeholder="Paste the job description here..."
              onTextChange={setJobDescText}
            />
          )}
        </div>

        <div className="upload-page__section">
          <h2>3. Configure Questions</h2>
          <QuestionCountSelector
            value={questionCount}
            onChange={setQuestionCount}
          />
        </div>

        {generationError && (
          <div className="upload-page__error">{generationError}</div>
        )}

        <Button
          variant="primary"
          size="large"
          onClick={handleGenerate}
          disabled={!canGenerate}
          isLoading={isGenerating}
          className="upload-page__submit"
        >
          {isGenerating ? 'Generating Questions...' : 'Generate Interview Questions'}
        </Button>

        {isGenerating && (
          <p className="upload-page__loading-note">
            This may take 20-40 seconds. Please wait...
          </p>
        )}
      </div>
    </div>
  );
}
