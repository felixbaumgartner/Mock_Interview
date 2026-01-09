const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc'];

export function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
    };
  }
  return { valid: true };
}

export function validateFileType(file: File): { valid: boolean; error?: string } {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Only PDF and DOCX files are supported',
    };
  }

  return { valid: true };
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return { valid: true };
}

export function validateTextLength(
  text: string,
  minLength: number = 50,
  maxLength: number = 20000
): { valid: boolean; error?: string } {
  if (text.length < minLength) {
    return {
      valid: false,
      error: `Text is too short. Minimum ${minLength} characters required.`,
    };
  }

  if (text.length > maxLength) {
    return {
      valid: false,
      error: `Text is too long. Maximum ${maxLength} characters allowed.`,
    };
  }

  return { valid: true };
}
