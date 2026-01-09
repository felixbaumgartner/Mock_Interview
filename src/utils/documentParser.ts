import { extractTextFromPDF } from './pdfParser';
import { extractTextFromDOCX } from './docxParser';
import { sanitizeText } from './sanitization';

export type SupportedFileType = 'pdf' | 'docx' | 'doc';

export async function parseDocument(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() as SupportedFileType;

  let extractedText: string;

  switch (extension) {
    case 'pdf':
      extractedText = await extractTextFromPDF(file);
      break;
    case 'docx':
    case 'doc':
      extractedText = await extractTextFromDOCX(file);
      break;
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }

  // Sanitize the extracted text
  const sanitized = sanitizeText(extractedText);

  if (!sanitized || sanitized.length < 50) {
    throw new Error('Could not extract sufficient text from the document. Please ensure the file contains readable text.');
  }

  return sanitized;
}
