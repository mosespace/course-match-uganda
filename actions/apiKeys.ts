'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateApiKey } from '@/lib/generateAPIKey';
import { getAuthenticatedUser } from '@/config/useAuth';

export async function createAPIKey(name: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        data: null,
        error: 'Your Not Authorized to perform this action',
      };
    }

    const apiKey: string = generateApiKey();

    // check if api-key already exists in the database!

    // create api-key if it doesn't exist
    const newApiKey = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        apiKey: apiKey,
      },
    });

    revalidatePath('/dashboard/integrations/api');

    return {
      success: true,
      data: newApiKey,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      error: 'Something went wrong; Please try again.',
    };
  }
}
export async function getUserApiKey(userId: string) {
  try {
    const key = await db.user.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      
      select: {
        apiKey: true,
      },
    });
    return key?.apiKey;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteAPIKey(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return {
        success: false,
        data: null,
        error: 'Your Not Authorized',
      };
    }

    // check if api-key already exists in the database!
    const existingKey = await db.user.findUnique({
      where: { id },
    });

    if (!existingKey) {
      return {
        success: false,
        data: null,
        error: 'The Key you want to delete does not exit',
      };
    }

    // delete api-key if it doesn't exist
    await db.user.update({
      where: {
      id,
      },
      data: {
      apiKey: null,
      },
    });

    revalidatePath('/dashboard/integrations/api');

    return {
      success: true,
      message: 'API-KEY Deleted Successfully!',
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      error: 'Something went wrong',
    };
  }
}
