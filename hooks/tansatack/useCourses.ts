import { ICourse, ICourseCreate } from '@/actions/courses';
import { courseApi } from '@/services/courses';
import { toast } from '@mosespace/toast';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

// Query keys for caching
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

export function useSuspenseCourses() {
  const { data: courses, refetch } = useSuspenseQuery({
    queryKey: courseKeys.lists(),
    queryFn: () => {
      // Handle SSR case
      if (typeof window === 'undefined') {
        return Promise.resolve([] as ICourse[]);
      }
      return courseApi.courses();
    },
  });

  return {
    courses: courses || [],
    refetch,
  };
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  // Update an existing course
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICourse }) =>
      courseApi.update(id, data),
    onSuccess: (data, variables) => {
      toast.success('Course updated successfully', '');
      // Invalidate specific course detail
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
    },
    onError: (error: Error) => {
      toast.error(
        'Failed to update course',
        ` error.message || 'Unknown error occurred`,
      );
      console.error('Update course error:', error);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  // Delete a course
  return useMutation({
    mutationFn: (id: string) => courseApi.delete(id),
    onSuccess: () => {
      toast.success('Course deleted successfully', '');
      // Invalidate course lists query
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(
        'Failed to delete [course]',
        `${error.message} || 'Unknown error occurred`,
      );
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  // Create a new transaction
  return useMutation({
    mutationFn: (data: ICourseCreate) => courseApi.create(data),
    onSuccess: (_, variables) => {
      toast.success('Course created successfully', '');

      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.slug as string),
      });
    },
    onError: (error: Error) => {
      toast.error(
        'Transaction failed',
        `${error.message} || 'Unknown error occurred`,
      );
    },
  });
}
