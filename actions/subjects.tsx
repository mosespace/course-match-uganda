'use server';

import { getCurrentUser } from '@/lib/session';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getSubjects(
  search?: string,
  page?: string,
  limit?: string,
) {
  try {
    const currentUser = await getCurrentUser();
    // console.log('Current user ✅:', currentUser);

    if (!currentUser) {
      return { success: false, error: 'Unauthorized' };
    }

    let url = `${baseUrl}/api/v1/subjects`;

    // only add query params if they are provided
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const apiKey = process.env.API_KEY;

    const response = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey as string,
        'x-user-role': currentUser.role as string,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Failed to fetch subjects',
      };
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error in fetching subjects:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
