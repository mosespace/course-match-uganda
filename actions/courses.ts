'use server';

import { getAuthenticatedApi } from '@/lib/axios';
import { CourseLevel, CourseStatus, Favorite, Subject } from '@prisma/client';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// Types
export type ICourse = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  code?: string;
  status?: CourseStatus;
  accreditedDate?: Date;
  expiryDate?: Date;
  requiredSubject?: Subject[];
  duration?: number;
  level?: CourseLevel;
  universityId?: string;
  favorites: Favorite;
};

export type ICourseCreate = Omit<ICourse, 'id'>;

export async function createCourse(
  data: ICourseCreate,
): Promise<ApiResponse<ICourseCreate>> {
  try {
    const api = await getAuthenticatedApi();
    // console.log('Creating course with data ✅:', api.defaults.headers);

    const res = await api.post('/courses', data);

    const course = res.data;

    return {
      success: true,
      data: course,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to create Course',
      data: null,
    };
  }
}

export async function getCourses(): Promise<ApiResponse<ICourse[]>> {
  try {
    const api = await getAuthenticatedApi();

    const res = await api.get('/courses');
    // console.log('Response ✅:', res)

    const courses = res.data;

    return {
      success: true,
      data: courses.data || [],
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch back Courses',
      data: null,
    };
  }
}

export async function getCoursesById(
  courseId: string,
): Promise<ApiResponse<ICourse>> {
  try {
    const api = await getAuthenticatedApi();

    const res = await api.get(`/courses/${courseId}`);

    const course = res.data;

    return {
      success: true,
      data: course.data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to fetch back a single Course',
      data: null,
    };
  }
}

export async function updateCourse(
  courseId: string,
  data: ICourseCreate,
): Promise<ApiResponse<ICourseCreate>> {
  try {
    const api = await getAuthenticatedApi();

    const res = await api.patch(`/courses/${courseId}`, data);

    const updated_plan = res.data;

    return {
      success: true,
      data: updated_plan,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to update a course with id: ' + courseId,
      data: null,
    };
  }
}

export async function deleteCourse(
  courseId: string,
): Promise<ApiResponse<ICourse>> {
  try {
    const api = await getAuthenticatedApi();

    const res = await api.put(`/courses/${courseId}`);

    const deleted_plan = res.data;

    return {
      success: true,
      data: deleted_plan,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to delete course with id: ' + courseId,
      data: null,
    };
  }
}
