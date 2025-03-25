import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const header_api_key = req.headers.get('x-api-key');
  // console.log('API KEY ✅:', apiKey);

  const apiKey = process.env.API_KEY;

  try {
    if (header_api_key !== apiKey) {
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

    // Ensure all courses have required fields and fill in defaults where necessary
    const subjectToCreate = subjects.map((subject) => ({
      name: subject.name,
      code: subject.code,
       category: subject.category || null,
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '2');
    const skip = (page - 1) * limit;

    // Build the where clause based on filters
    const where: any = {};

    // Search by subject name or parent name/email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await db.subject.count({ where });

    const courses = await db.subject.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      status: 200,
      message: 'Subjects fetched back successfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to create course',
    });
  }
}
