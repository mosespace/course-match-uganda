import { db } from '@/lib/db';
import { generateCode } from '@/lib/generateCode';
import { generateSlug } from '@/lib/generateSlug';
import { CourseLevel, CourseStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  // console.log('API KEY ✅:', apiKey);

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized',
        status: 401,
      });
    }

    const body = await req.json();
    const course = body;

    if (typeof course !== 'object' || course === null) {
      return NextResponse.json({
        data: null,
        message: 'Invalid request format. Expected an object of course.',
        status: 400,
      });
    }

    const entryPoints = Math.floor(Math.random() * 20) + 1;
    const duration = Math.floor(Math.random() * 3) + 1;

    // Ensure that the course has required fields and fill in defaults where necessary
    const courseToCreate = {
      name: course.name,
      code: generateCode(course.name),
      slug: generateSlug(course.name),
      status:
        course.status === 'Under Review'
          ? CourseStatus.UnderReview
          : course.status,
      accreditedDate: new Date(course.accreditedDate),
      expiryDate: new Date(course.expiryDate),
      duration: course.duration || duration,
      entryPoints: course.entryPoints || entryPoints,
      level: course.level || CourseLevel.CERTIFICATE,
      universityId: course.universityId || 'cm8enyhpf008orxakrrl3ji8r',
    };

    // Create all new course
    const createdCampuses = await db.course.create({
      data: courseToCreate,
    });

    return NextResponse.json({
      data: createdCampuses,
      message: 'Course created successfully',
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: `Failed to create course due to the following error: ${error}`,
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
