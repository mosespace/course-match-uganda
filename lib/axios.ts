'use server';

import axios from 'axios';
import { authOptions } from './auth';
import { getServerSession } from 'next-auth';
import { getUserApiKey } from '@/actions/apiKeys';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Create a base axios instance without authentication
const baseApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a function that returns an authenticated API instance
export async function getAuthenticatedApi() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? '';
  const apiKey = await getUserApiKey(userId);

  // Return a new instance with the API key
  return axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'x-api-key': apiKey || '',
      'x-user-id': userId || '',
      'x-user-email': session?.user.email || '',
    },
    timeout: 30000, // 10 seconds timeout
  });
}

// Use this for unauthenticated requests
export { baseApi as api };
