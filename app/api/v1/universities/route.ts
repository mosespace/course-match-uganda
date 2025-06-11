import { db } from '@/lib/db';
import { generateSlug } from '@/lib/generateSlug';
import { Prisma, UniversityStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// create university
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

// Helper function to normalize university names for comparison
// function normalizeUniversityName(name: string): string {
//   let normalized = name.toLowerCase();
//   normalized = normalized.replace(/\([^)]*\)/g, '').trim();
//   return normalized;
// }

// export async function POST(req: NextRequest) {
//   const header_api_key = req.headers.get('x-api-key');
//   const apiKey = process.env.API_KEY;

//   try {
//     if (header_api_key !== apiKey) {
//       return NextResponse.json({
//         data: null,
//         message: 'You are not authorized',
//         status: 401,
//       });
//     }

//     const body = await req.json();
//     const universities: any[] = body;

//     if (!Array.isArray(universities)) {
//       return NextResponse.json({
//         data: null,
//         message:
//           'Invalid request format. Expected an array of university objects.',
//         status: 400,
//       });
//     }

//     const results: any[] = [];

//     const allExistingUniversities = await db.university.findMany({
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//       },
//     });

//     const existingNormalizedNamesMap = new Map<string, any>();
//     for (const existingUni of allExistingUniversities) {
//       existingNormalizedNamesMap.set(
//         normalizeUniversityName(existingUni.name),
//         existingUni,
//       );
//     }

//     for (const university of universities) {
//       if (
//         typeof university !== 'object' ||
//         university === null ||
//         !university.name ||
//         typeof university.name !== 'string'
//       ) {
//         results.push({
//           input: university,
//           status: 'skipped',
//           message: 'Invalid university object format or missing name.',
//         });
//         continue;
//       }

//       const originalName = university.name;
//       const normalizedIncomingName = normalizeUniversityName(originalName);

//       const existingUniversity = existingNormalizedNamesMap.get(
//         normalizedIncomingName,
//       );

//       if (existingUniversity) {
//         results.push({
//           input: originalName,
//           status: 'exists',
//           message: `University "${originalName}" already exists (normalized as "${normalizedIncomingName}").`,
//           data: existingUniversity,
//         });
//       } else {
//         const universitiesToCreate = {
//           name: originalName,
//           description: university.description || null,
//           slug: generateSlug(originalName),
//           district: university.district || null,
//           status: university.status || UniversityStatus.Public,
//           logo:
//             university.logo ||
//             'https://1k60xyo2z1.ufs.sh/f/Guex3D2XmynflHpmmO9BbCEUzjguTyNW9iB7PtwY4XZVAxL5',
//         };

//         try {
//           const createdUniversity = await db.university.create({
//             data: universitiesToCreate,
//           });
//           results.push({
//             input: originalName,
//             status: 'created',
//             message: 'University created successfully.',
//             data: createdUniversity,
//           });
//         } catch (dbError: any) {
//           // --- BEGIN FIX FOR console.error TypeError ---
//           const errorMessage =
//             (dbError instanceof Error ? dbError.message : null) || // Prefer Error.message
//             (typeof dbError === 'object' && dbError !== null
//               ? JSON.stringify(dbError)
//               : String(dbError)) || // Fallback to JSON.stringify for objects, or String() for others
//             'Unknown database error';

//           const errorCode = dbError?.code || 'N/A';

//           // Ensure the second argument to console.error is never null/undefined if dbError is null/undefined
//           const logPayload =
//             dbError !== null && dbError !== undefined ? dbError : {}; // Pass an empty object if dbError is null/undefined

//           console.error(
//             `Database operation failed for "${originalName}" (Code: ${errorCode}): ${errorMessage}`,
//             logPayload, // Pass the safe payload
//           );
//           // --- END FIX FOR console.error TypeError ---

//           if (errorCode === 'P2002') {
//             results.push({
//               input: originalName,
//               status: 'failed',
//               message:
//                 'Failed to create: A university with this slug already exists (even if name was different).',
//               error: errorMessage,
//             });
//           } else {
//             results.push({
//               input: originalName,
//               status: 'failed',
//               message: `Failed to create university: ${errorMessage}`,
//               error: errorMessage,
//             });
//           }
//         }
//       }
//     }

//     return NextResponse.json({
//       data: results,
//       message: 'Batch university processing complete.',
//       status: 200,
//     });
//   } catch (error: any) {
//     console.error('API route error:', error); // Log the full error object here too
//     return NextResponse.json({
//       data: null,
//       status: 500,
//       message: 'An unexpected error occurred during batch processing.',
//     });
//   }
// }

// get universities
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const { searchParams } = new URL(req.url);

  // Pagination and filtering params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '4');
  const search = searchParams.get('search') || '';
  const district = searchParams.get('district') || '';
  const status = searchParams.get('status') || '';

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized',
        status: 401,
      });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    // Build where clause for filtering
    const where: Prisma.UniversityWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(district && { district }),
      ...(status && { status: status as UniversityStatus }),
    };

    // Get total count for pagination
    const total = await db.university.count({ where });

    // Get paginated results
    const universities = await db.university.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: universities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + universities.length < total,
        hasPrevPage: page > 1,
      },
      status: 200,
      message: 'Universities fetched successfully',
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
