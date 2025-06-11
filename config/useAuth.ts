import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { Role } from '@prisma/client';

// Type for authenticated user with permissions
export interface AuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: Role;
  permissions: string[];
  email?: string | null;
  profileImage?: string | null;
}


// Function to get authenticated user or redirect
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  return session.user as AuthenticatedUser;
}

