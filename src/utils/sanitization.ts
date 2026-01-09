export function sanitizeText(text: string): string {
  // Remove any HTML tags
  const withoutHTML = text.replace(/<[^>]*>/g, '');

  // Remove excessive whitespace
  const normalized = withoutHTML.replace(/\s+/g, ' ').trim();

  return normalized;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}
