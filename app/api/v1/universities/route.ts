import { db } from '@/lib/db';
import { generateSlug } from '@/lib/generateSlug';
import { UniversityStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// cretae university
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
    const university = body;

    // console.log('Universities ✅:', universities);

    if (typeof university !== 'object' || university === null) {
      return NextResponse.json({
        data: null,
        message: 'Invalid request format. Expected object of university.',
        status: 400,
      });
    }

    // Ensure that the university has required fields and fill in defaults where necessary
    const universitiesToCreate = {
      name: university.name,
      description: university.description || null,
      slug: generateSlug(university.name),
      district: university.district,
      status: UniversityStatus.Public,
      logo:
        university.logo ||
        'https://1k60xyo2z1.ufs.sh/f/Guex3D2XmynflHpmmO9BbCEUzjguTyNW9iB7PtwY4XZVAxL5',
    };

    try {
      // Create all new university
      const createdUniversity = await db.university.create({
        data: universitiesToCreate,
      });

      return NextResponse.json({
        data: createdUniversity,
        message: 'Universities created successfully',
        status: 201,
      });
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw dbError; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to create university',
    });
  }
}

// get universities
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized',
        status: 401,
      });
    }

    const universities = await db.university.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: universities,
      status: 200,
      message: 'Universities featched back succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to fetch universities',
    });
  }
}

// delete university
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

    const universities = await db.university.deleteMany({});

    return NextResponse.json({
      data: universities,
      status: 200,
      message: 'Universities deleted succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to delete universities',
    });
  }
}

/** Un-Coment Routes Below if You Want To Use Them */
// export async function POST(req: NextRequest) {
//   const apiKey = req.headers.get('x-api-key');
//   console.log('API KEY ✅:', apiKey);
//   try {
//     if (apiKey !== 'desishub-inc') {
//       return NextResponse.json({
//         data: null,
//         message: 'You are not authorized',
//         status: 401,
//       });
//     }

//     const body = await req.json();
//     const universities = body;

//     // console.log('Universities ✅:', universities);

//     if (!Array.isArray(universities)) {
//       return NextResponse.json({
//         data: null,
//         message: 'Invalid request format. Expected array of universities.',
//         status: 400,
//       });
//     }

//     // Ensure all universities have required fields and fill in defaults where necessary
//     const universitiesToCreate = universities.map((university) => ({
//       name: university.name,
//       description: university.description || null,
//       slug: generateSlug(university.name),
//       district: university.district,
//       status: UniversityStatus.Public,
//       logo:
//         university.logo ||
//         'https://1k60xyo2z1.ufs.sh/f/Guex3D2XmynflHpmmO9BbCEUzjguTyNW9iB7PtwY4XZVAxL5',
//     }));

//     // console.log('Universities to create ✅:', universitiesToCreate);

//     try {
//       // Delete existing universities first
//       await db.university.deleteMany();
//       console.log('Existing universities deleted....');

//       // Create all new universities
//       const createdCampuses = await db.university.createMany({
//         data: universitiesToCreate,
//         skipDuplicates: true,
//       });

//       return NextResponse.json({
//         data: createdCampuses,
//         message: 'Universities created successfully',
//         status: 201,
//       });
//     } catch (dbError) {
//       console.error('Database operation failed:', dbError);
//       throw dbError; // Re-throw to be caught by outer try-catch
//     }
//   } catch (error) {
//     return NextResponse.json({
//       data: null,
//       status: 500,
//       message: 'Failed to create university',
//     });
//   }
// }
