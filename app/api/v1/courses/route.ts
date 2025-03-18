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
    const courses = body;

    if (!Array.isArray(courses)) {
      return NextResponse.json({
        data: null,
        message: 'Invalid request format. Expected array of courses.',
        status: 400,
      });
    }
    // Delete existing courses first

    // Ensure all courses have required fields and fill in defaults where necessary
    const courseToCreate = courses.map((course) => ({
      name: course.name,
      code: course.code,
      slug: course.slug,
      description: course.description || null,
      keywords: course.keywords,
      duration: course.duration,
      entryPoints: parseInt(course.entryPoints),
      level: course.level,
      specialRequirements: course.specialRequirements,
      universityId: course.universityId,
    }));

    // console.log('Courses to create ✅:', courseToCreate);
    await db.course.deleteMany();
    console.log('Existing courses deleted....');
    // Create all new courses
    const createdCampuses = await db.course.createMany({
      data: courseToCreate,
      skipDuplicates: true,
    });

    return NextResponse.json({
      data: createdCampuses,
      message: 'Courses created successfully',
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

    const courses = await db.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: courses,
      status: 200,
      message: 'Courses featched back succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to create course',
    });
  }
}
