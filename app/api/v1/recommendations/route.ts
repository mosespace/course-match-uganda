import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { CourseLevel, CourseStatus } from '@prisma/client';
import {
  normalizeUniversityName,
  normalizeCourseName,
} from '@/utils/normalization';
import { generateSlug } from '@/lib/generateSlug';

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
                create: {
                  name: subjectName.trim(),
                  code: subjectName.trim().toLowerCase().replace(/\s+/g, '_'),
                },
                select: { id: true },
              });
              requiredSubjectsToConnect.push({ id: subjectRecord.id });
            } catch (subjectError: any) {
              // Be extra careful logging here too
              console.warn(
                `⚠️ Failed to find/create subject "${subjectName}" for course "${originalCourseName}": ${
                  (subjectError instanceof Error
                    ? subjectError.message
                    : null) ||
                  (typeof subjectError === 'object' && subjectError !== null
                    ? JSON.stringify(subjectError)
                    : String(subjectError)) ||
                  'Unknown subject error'
                }`,
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
        if (courseData.duration >= 4) {
          courseLevel = CourseLevel.BACHELORS;
        } else if (courseData.duration >= 2) {
          courseLevel = CourseLevel.DIPLOMA;
        }
      }

      const courseToCreate = {
        name: originalCourseName,
        code: courseData.code || null,
        slug: generateSlug(originalCourseName),
        status: CourseStatus.Active,
        duration: courseData.duration || null,
        entryPoints: courseData.entryPoints || null,
        level: courseLevel,
        description: courseData.description || null,
        university: {
          connect: { id: universityId },
        },
        // IMPORTANT: For requiredSubjects, ensure it matches your Prisma schema
        // It should be 'connect' for the many-to-many relation, but with the array
        requiredSubjects: {
          connect: requiredSubjectsToConnect, // This is correct if `requiredSubjectsToConnect` is [{id: 'abc'}, {id: 'def'}]
        },
        // Ensure otherRequirements matches your model. If it's `String[]`, this is fine.
        otherRequirements: courseData.other_requirements || [],
      };

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
        // --- THE MOST ROBUST FIX for console.error TypeError ---
        const errorMessage =
          (dbError instanceof Error ? dbError.message : null) ||
          (typeof dbError === 'object' && dbError !== null
            ? JSON.stringify(dbError)
            : String(dbError)) ||
          'Unknown database error';

        const errorCode = dbError?.code || 'N/A';

        // Convert the error object to a JSON string for logging,
        // which completely bypasses the TypeError by providing a string.
        const errorJsonString =
          typeof dbError === 'object' && dbError !== null
            ? JSON.stringify(dbError, Object.getOwnPropertyNames(dbError)) // Safely stringify even non-enumerable properties
            : String(dbError); // Fallback to String() for primitives or null/undefined

        console.error(
          `Database operation failed for course "${originalCourseName}" (Code: ${errorCode}): ${errorMessage}`,
          errorJsonString, // Pass the error as a JSON string to console.error
        );
        // --- END ROBUST FIX ---

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
    // This is the outer catch for any unexpected errors before/outside the loop
    console.error('API route error:', error);
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'An unexpected error occurred during batch processing.',
    });
  }
}
