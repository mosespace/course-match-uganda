import { db } from '@/lib/db';
import { generateSlug } from '@/lib/generateSlug';
import {
  normalizeCourseName,
  normalizeUniversityName,
} from '@/utils/normalization';
import { CourseLevel, CourseStatus } from '@prisma/client';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const apiKey = req.headers.get('x-api-key');
//   // console.log('API KEY ✅:', apiKey);

//   try {
//     if (apiKey !== 'desishub-inc') {
//       return NextResponse.json({
//         data: null,
//         message: 'You are not authorized',
//         status: 401,
//       });
//     }

//     const body = await req.json();
//     const course = body;

//     if (typeof course !== 'object' || course === null) {
//       return NextResponse.json({
//         data: null,
//         message: 'Invalid request format. Expected an object of course.',
//         status: 400,
//       });
//     }

//     const entryPoints = Math.floor(Math.random() * 20) + 1;
//     const duration = Math.floor(Math.random() * 3) + 1;

//     // Ensure that the course has required fields and fill in defaults where necessary
//     const courseToCreate = {
//       name: course.name,
//       code: generateCode(course.name),
//       slug: generateSlug(course.name),
//       status:
//         course.status === 'Under Review'
//           ? CourseStatus.UnderReview
//           : course.status,
//       accreditedDate: new Date(course.accreditedDate),
//       expiryDate: new Date(course.expiryDate),
//       duration: course.duration || duration,
//       entryPoints: course.entryPoints || entryPoints,
//       level: course.level || CourseLevel.CERTIFICATE,
//       universityId: course.universityId || 'cm8enyhpf008orxakrrl3ji8r',
//     };

//     // Create all new course
//     const createdCampuses = await db.course.create({
//       data: courseToCreate,
//     });

//     return NextResponse.json({
//       data: createdCampuses,
//       message: 'Course created successfully',
//       status: 201,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       data: null,
//       status: 500,
//       message: `Failed to create course due to the following error: ${error}`,
//     });
//   }
// }

export async function POST(req: NextRequest) {
  const header_api_key = req.headers.get('x-api-key');
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
    const incomingCourses: any[] = body;

    if (!Array.isArray(incomingCourses)) {
      return NextResponse.json({
        data: null,
        message: 'Invalid request format. Expected an array of course objects.',
        status: 400,
      });
    }

    const results: any[] = [];

    const allUniversities = await db.university.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const universityLookupMap = new Map<string, string>();
    for (const uni of allUniversities) {
      universityLookupMap.set(normalizeUniversityName(uni.name), uni.id);
    }

    const existingCoursesByUniversity = new Map<string, Map<string, any>>();
    const allExistingCourses = await db.course.findMany({
      select: {
        id: true,
        name: true,
        universityId: true,
        slug: true,
      },
    });

    for (const course of allExistingCourses) {
      if (!existingCoursesByUniversity.has(course.universityId)) {
        existingCoursesByUniversity.set(course.universityId, new Map());
      }
      existingCoursesByUniversity
        .get(course.universityId)!
        .set(normalizeCourseName(course.name), course);
    }

    for (const courseData of incomingCourses) {
      if (
        typeof courseData !== 'object' ||
        courseData === null ||
        !courseData.name ||
        typeof courseData.name !== 'string' ||
        !courseData.university ||
        typeof courseData.university !== 'string'
      ) {
        results.push({
          input: courseData,
          status: 'skipped',
          message:
            'Invalid course object format, missing name or university name.',
        });
        continue;
      }

      const originalCourseName = courseData.name;
      const originalUniversityName = courseData.university;
      const normalizedCourseName = normalizeCourseName(originalCourseName);
      const normalizedUniversityName = normalizeUniversityName(
        originalUniversityName,
      );

      let universityId: string | undefined;
      const foundUniversityId = universityLookupMap.get(
        normalizedUniversityName,
      );

      if (foundUniversityId) {
        universityId = foundUniversityId;
      } else {
        results.push({
          input: originalCourseName,
          status: 'skipped',
          message: `University "${originalUniversityName}" not found. Course cannot be created.`,
        });
        continue;
      }

      const universityCoursesMap =
        existingCoursesByUniversity.get(universityId);
      if (
        universityCoursesMap &&
        universityCoursesMap.has(normalizedCourseName)
      ) {
        const existingCourse = universityCoursesMap.get(normalizedCourseName);
        results.push({
          input: originalCourseName,
          status: 'exists',
          message: `Course "${originalCourseName}" already exists for university "${originalUniversityName}".`,
          data: existingCourse,
        });
        continue;
      }

      const requiredSubjectsToConnect: { id: string }[] = [];
      if (
        Array.isArray(courseData.required_subjects) &&
        courseData.required_subjects.length > 0
      ) {
        for (const subjectName of courseData.required_subjects) {
          if (typeof subjectName === 'string' && subjectName.trim()) {
            try {
              const subjectRecord = await db.subject.upsert({
                where: { name: subjectName.trim() },
                update: {},
                create: { name: subjectName.trim(), code: subjectName.trim() },
                select: { id: true },
              });
              requiredSubjectsToConnect.push({ id: subjectRecord.id });
            } catch (subjectError: any) {
              console.warn(
                `⚠️ Failed to find/create subject "${subjectName}" for course "${originalCourseName}": ${subjectError?.message || JSON.stringify(subjectError)}`,
              );
            }
          }
        }
      }

      let courseLevel: CourseLevel = CourseLevel.CERTIFICATE;
      if (
        courseData.duration !== undefined &&
        typeof courseData.duration === 'number'
      ) {
        if (courseData.duration === 3) {
          courseLevel = CourseLevel.BACHELORS;
        } else if (courseData.duration >= 2) {
          courseLevel = CourseLevel.DIPLOMA;
        } else if (courseData.duration > 3 && courseData.duration <= 4) {
          courseLevel = CourseLevel.MASTERS;
        } else if (courseData.duration > 4 && courseData.duration <= 6) {
          courseLevel = CourseLevel.PHD;
        }
      }

      const courseToCreate = {
        name: originalCourseName,
        code: courseData.code,
        slug: generateSlug(originalCourseName),
        status: CourseStatus.Active,
        duration: courseData.duration,
        level: courseLevel,
        description: courseData.description,
        university: {
          connect: { id: universityId },
        },
        requiredSubjects: {
          connect: requiredSubjectsToConnect,
        },
        otherRequirements: courseData.other_requirements,
      };

      console.log('Course To Create ✅', courseToCreate);

      try {
        const createdCourse = await db.course.create({
          data: courseToCreate,
        });
        results.push({
          input: originalCourseName,
          status: 'created',
          message: 'Course created successfully.',
          data: createdCourse,
        });
      } catch (dbError: any) {
        // --- BEGIN TRUE FIX FOR console.error TypeError ---
        const errorMessage =
          (dbError instanceof Error ? dbError.message : null) ||
          (typeof dbError === 'object' && dbError !== null
            ? JSON.stringify(dbError)
            : String(dbError)) ||
          'Unknown database error';

        const errorCode = dbError?.code || 'N/A';

        // Log the string message and then the stringified error object to avoid type issues.
        // Or if you want the object inspeactable, make sure it's never null/undefined.
        const errorToLog =
          dbError instanceof Error ||
          (typeof dbError === 'object' && dbError !== null)
            ? dbError
            : { rawError: String(dbError) };

        console.error(
          `Database operation failed for course "${originalCourseName}" (Code: ${errorCode}): ${errorMessage}`,
          errorToLog, // Pass a guaranteed non-null object for logging
        );
        // --- END TRUE FIX FOR console.error TypeError ---

        if (errorCode === 'P2002') {
          results.push({
            input: originalCourseName,
            status: 'failed',
            message:
              'Failed to create: A course with this slug already exists (even if name was different).',
            error: errorMessage,
          });
        } else {
          results.push({
            input: originalCourseName,
            status: 'failed',
            message: `Failed to create course: ${errorMessage}`,
            error: errorMessage,
          });
        }
      }
    }

    return NextResponse.json({
      data: results,
      message: 'Batch course processing complete.',
      status: 200,
    });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'An unexpected error occurred during batch processing.',
    });
  }
}

export async function GET(req: NextRequest) {
  const headersList = await headers();
  const apiKey = headersList.get('x-api-key');
  // console.log('API KEY ✅:', apiKey);
  // check if the request has a valid header for x-api-key
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        data: null,
        error: 'API Key is required',
        success: false,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    // check if the api-key from the headers is valid
    const validKey = await db.user.findUnique({ where: { apiKey: apiKey } });

    if (!validKey) {
      return new Response(
        JSON.stringify({
          data: null,
          error: 'Invalid API Key',
          success: false,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await db.course.count({ where });

    const courses = await db.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        university: true,
      },
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

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized to perform this action',
        status: 401,
      });
    }

    const courses = await db.course.deleteMany({});

    return NextResponse.json({
      data: courses,
      status: 200,
      message: 'Courses deleted succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to delete courses',
    });
  }
}

/** Un-Coment Routes Below if You Want To Use Them */
// Create Many-------------------------------------------------
// export async function POST(req: NextRequest) {
//   const apiKey = req.headers.get('x-api-key');
//   // console.log('API KEY ✅:', apiKey);

//   const universities = await getUniversities();
//   // console.log('University IDs ✅:', universities);

//   try {
//     if (apiKey !== 'desishub-inc') {
//       return NextResponse.json({
//         data: null,
//         message: 'You are not authorized',
//         status: 401,
//       });
//     }

//     const body = await req.json();
//     const courses = body;

//     if (!Array.isArray(courses)) {
//       return NextResponse.json({
//         data: null,
//         message: 'Invalid request format. Expected array of courses.',
//         status: 400,
//       });
//     }
//     // Delete existing courses first
//     await db.course.deleteMany({});

//     // Ensure all courses have required fields and fill in defaults where necessary
//     const courseToCreate = courses.map((course) => {
//       // Find the matching university based on name
//       const university = universities?.find(
//         (uni) => uni.slug === generateSlug(course.institutionName),
//       );

//       if (!university) {
//         console.log(
//           `Invalid university slug: ${generateSlug(course.institutionName)}`,
//         );
//       }

//       const entryPoints = Math.floor(Math.random() * 20) + 1;
//       const duration = Math.floor(Math.random() * 3) + 1;

//       return {
//         name: course.name,
//         code: generateCode(course.name),
//         slug: generateSlug(course.name),
//         status:
//           course.status === 'Under Review' ? 'UnderReview' : course.status,
//         accreditedDate: new Date(course.accreditedDate),
//         expiryDate: new Date(course.expiryDate),
//         duration: duration,
//         entryPoints: entryPoints,
//         level: course.level || CourseLevel.CERTIFICATE,
//         universityId: university ? university.id : 'cm8enyhpf008orxakrrl3ji8r',
//       };
//     });

//     // console.log('Courses to create ✅:', courseToCreate[1000]);
//     await db.course.deleteMany();
//     console.log('✅ Existing courses deleted....');
//     // Create all new courses
//     const createdCampuses = await db.course.createMany({
//       data: courseToCreate,
//       skipDuplicates: true,
//     });

//     console.log('Courses to create ✅:', createdCampuses);

//     return NextResponse.json({
//       data: createdCampuses,
//       message: 'Courses created successfully',
//       status: 201,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       data: null,
//       status: 500,
//       message: `Failed to create course due to the following error: ${error}`,
//     });
//   }
// }
