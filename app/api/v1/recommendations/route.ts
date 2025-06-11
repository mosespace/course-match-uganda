import { db } from '@/lib/db';
import { Subject } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface ALevelResults {
  [subjectName: string]: string; // e.g. { Mathematics: 'A', Economics: 'D' }
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== 'desishub-inc') {
    return NextResponse.json({
      data: null,
      message: 'You are not authorized',
      status: 401,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({
      data: null,
      message: 'Invalid JSON body',
      status: 400,
    });
  }

  const { studentId, aLevelResults, page = 1, limit = 4 } = body;

  if (!aLevelResults && !studentId) {
    return NextResponse.json({
      data: null,
      message: 'Provide either studentId or aLevelResults',
      status: 400,
    });
  }

  try {
    let studentSubjects: string[] = [];

    if (studentId) {
      const student = await db.student.findUnique({
        where: { id: studentId },
        include: { subjectCombinations: true },
      });

      if (!student) {
        return NextResponse.json({
          data: null,
          message: 'Student not found',
          status: 404,
        });
      }

      studentSubjects = student.subjectIds;
    } else if (aLevelResults) {
      // Here you map subject names (like 'Mathematics') to Subject IDs in your database
      const allSubjects = await db.subject.findMany();

      // Try to map the incoming subjects to IDs in the DB
      studentSubjects = allSubjects
        .filter((dbSubject) => aLevelResults[dbSubject.name] !== undefined)
        .map((dbSubject) => dbSubject.id);

      if (studentSubjects.length === 0) {
        return NextResponse.json({
          data: null,
          message: 'No matching subjects found in the database',
          status: 400,
        });
      }
    }

    // Fetch universities and their courses
    const universities = await db.university.findMany({
      include: {
        courses: {
          include: {
            requiredSubjects: true,
          },
        },
      },
    });

    // Calculate recommendations
    const recommendations: any[] = [];
    universities.forEach((university) => {
      university.courses.forEach((course) => {
        const matchScore = calculateMatchScore(
          studentSubjects,
          course.requiredSubjects,
        );
        recommendations.push({
          university: {
            id: university.id,
            name: university.name,
            status: university.status,
          },
          course: {
            id: course.id,
            name: course.name,
            slug: course.slug,
            status: course.status,
            level: course.level,
          },
          matchScore,
        });
      });
    });

    // Sort recommendations by matchScore descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = recommendations.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginated,
      meta: {
        total: recommendations.length,
        page,
        limit,
        totalPages: Math.ceil(recommendations.length / limit),
        hasNextPage: page * limit < recommendations.length,
        hasPrevPage: page > 1,
      },
      status: 200,
      message: 'Course recommendations fetched successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to fetch recommendations',
    });
  }
}

function calculateMatchScore(
  studentSubjects: string[],
  requiredSubjects: Subject[],
): number {
  if (requiredSubjects.length === 0) return 0;
  const matchCount = requiredSubjects.filter((rs) =>
    studentSubjects.includes(rs.id),
  ).length;
  return (matchCount / requiredSubjects.length) * 100;
}
