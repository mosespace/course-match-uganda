import { db } from '@/lib/db';
import { getUniversities } from '@/actions/universities';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  // console.log('API KEY ✅:', apiKey);

  // const universities = await getUniversities();
  // console.log('University IDs ✅:', universities);

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized',
        status: 401,
      });
    }

    const body = await req.json();
    const subjects = body;

    if (!Array.isArray(subjects)) {
      return NextResponse.json({
        data: null,
        message: 'Invalid request format. Expected array of courses.',
        status: 400,
      });
    }
    // Delete existing courses first

    // Ensure all courses have required fields and fill in defaults where necessary
    const subjectToCreate = subjects.map((subject) => ({
      name: subject.name,
      code: subject.code,
      description: subject.description || null,
    }));

    // console.log('Courses to create ✅:', courseToCreate);
    await db.subject.deleteMany();
    console.log('Existing subjects deleted....');
    // Create all new courses
    const createdSubjects = await db.subject.createMany({
      data: subjectToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({
      data: createdSubjects,
      message: 'Subjects created successfully',
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to create course',
    });
  }
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized to perform this action',
        status: 401,
      });
    }

    const courses = await db.subject.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: courses,
      status: 200,
      message: 'Subjects featched back succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to create course',
    });
  }
}
