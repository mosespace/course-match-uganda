import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const apiKey = req.headers.get('x-api-key');
  // console.log('Id ✅:', id);

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized',
        status: 401,
      });
    }

    const university = await db.university.findUnique({
      where: {
        id,
      },
    });

    if (!university) {
      return NextResponse.json({
        data: null,
        status: 404,
        message: `University with ${id} not found`,
      });
    }

    return NextResponse.json({
      data: university,
      status: 200,
      message: 'University featched back succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to fetch university',
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const apiKey = req.headers.get('x-api-key');

  try {
    if (apiKey !== 'desishub-inc') {
      return NextResponse.json({
        data: null,
        message: 'You are not authorized',
        status: 401,
      });
    }

    const university = await db.university.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      data: university,
      status: 200,
      message: 'University deleted succesfully',
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      status: 500,
      message: 'Failed to delete university',
    });
  }
}
