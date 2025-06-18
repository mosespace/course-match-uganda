import { Suspense } from 'react';
import CourseListingPage from './course-listing-page';

export default function CoursesPage() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <CourseListingPage />
    </Suspense>
  );
}
