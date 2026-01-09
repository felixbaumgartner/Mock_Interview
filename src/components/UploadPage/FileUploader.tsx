import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseDocument } from '@/utils/documentParser';
import { validateFile } from '@/utils/validation';
import './FileUploader.css';

interface FileUploaderProps {
  label: string;
  onTextExtracted: (text: string) => void;
}

export function FileUploader({
  label,
  onTextExtracted,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedPreview, setExtractedPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      console.log('FileUploader - onDrop called', {
        acceptedFiles: acceptedFiles.length,
        rejectedFiles: rejectedFiles.length
      });

      setError(null);

      if (rejectedFiles.length > 0) {
        console.log('FileUploader - Files rejected:', rejectedFiles);
        setError('Please upload only PDF or DOCX files under 10MB');
        return;
      }

      if (acceptedFiles.length === 0) {
        console.log('FileUploader - No files accepted');
        return;
      }

      const selectedFile = acceptedFiles[0];
      console.log('FileUploader - Processing file:', selectedFile.name, selectedFile.type);

      // Validate file
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        console.log('FileUploader - Validation failed:', validation.error);
        setError(validation.error || 'Invalid file');
        return;
      }

      setFile(selectedFile);
      setIsParsing(true);

      try {
        console.log('FileUploader - Starting to parse document');
        const text = await parseDocument(selectedFile);
        console.log('FileUploader - Document parsed successfully, length:', text.length);
        setExtractedPreview(text.substring(0, 500));
        onTextExtracted(text);
      } catch (err) {
        console.error('FileUploader - Parse error:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse document');
        setFile(null);
      } finally {
        setIsParsing(false);
      }
    },
    [onTextExtracted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="file-uploader">
      <label className="file-uploader__label">{label}</label>

      <div
        {...getRootProps()}
        className={`file-uploader__dropzone ${
          isDragActive ? 'file-uploader__dropzone--active' : ''
        } ${error ? 'file-uploader__dropzone--error' : ''} ${
          file && !error ? 'file-uploader__dropzone--success' : ''
        }`}
      >
        <input {...getInputProps()} />

        {isParsing ? (
          <p>Parsing document...</p>
        ) : file && !error ? (
          <>
            <p className="file-uploader__filename">✓ {file.name}</p>
            {extractedPreview && (
              <p className="file-uploader__preview">
                Preview: {extractedPreview}
                {extractedPreview.length >= 500 && '...'}
              </p>
            )}
          </>
        ) : (
          <>
            <p>
              {isDragActive
                ? 'Drop file here'
                : 'Drag & drop file here, or click to select'}
            </p>
            <button type="button" className="file-uploader__browse-btn">
              Browse Files
            </button>
          </>
        )}
      </div>

      {error && <p className="file-uploader__error">{error}</p>}

      <p className="file-uploader__help">
        Supported formats: PDF, DOCX (max 10MB)
      </p>
    </div>
  );
}
