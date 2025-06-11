import { Suspense } from 'react';
import CourseListingPage from './course-listing-page';

interface SearchParams {
  search?: string;
  category?: string;
  instructor?: string;
  price?: string;
  sort?: string;
}



export default function CoursesPage() {
  return (
    <Suspense fallback={<></>}>
      <CourseListingPage  />
    </Suspense>
  );
}
