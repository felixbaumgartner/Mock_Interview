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
    console.log('🔍 API Request:', url, options);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('🔍 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);

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
          `Server error: ${errorText}`,
          response.status
        );
      }
      throw new APIError(`Request failed: ${errorText}`, response.status);
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('❌ API Client Error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new APIError(error.message);
    }
    throw new APIError('Network error. Please check your connection.');
  }
}
