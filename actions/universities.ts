'use server';

import { db } from '@/lib/db';

export async function getUniversities() {
  try {
    const universities = await db.university.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return universities;
  } catch (error) {}
}
