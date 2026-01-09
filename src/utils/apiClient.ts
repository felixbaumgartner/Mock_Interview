const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export async function callAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new APIError(
          'Rate limit exceeded. Please try again in an hour.',
          429
        );
      }
      if (response.status === 400) {
        throw new APIError(
          'Invalid request. Please check your inputs.',
          400
        );
      }
      if (response.status >= 500) {
        throw new APIError(
          'Server error. Please try again later.',
          response.status
        );
      }
      throw new APIError('Request failed', response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new APIError(error.message);
    }
    throw new APIError('Network error. Please check your connection.');
  }
}
