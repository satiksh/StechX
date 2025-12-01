const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  projectType: string;
  budget: number;
  message: string;
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Something went wrong' };
    }

    const result = await response.json();
    return { data: result };
  } catch (error) {
    return { error: 'Failed to connect to server' };
  }
}
