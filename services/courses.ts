import {
  ICourseCreate,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from '@/actions/courses';

// API client that uses server actions
export const courseApi = {
  // Get courses
  courses: async () => {
    const response = await getCourses();
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch back courses');
    }

    // console.log('Response ✅;', response);
    return response.data;
  },

  // Update an existing course
  update: async (id: string, data: ICourseCreate) => {
    const response = await updateCourse(id, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update course');
    }
    return response.data;
  },

  // Delete a course
  delete: async (id: string) => {
    const response = await deleteCourse(id);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete a course');
    }
    return true;
  },

  // Create a new course
  create: async (data: ICourseCreate) => {
    const response = await createCourse(data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create a course');
    }
    return response.data;
  },
};
