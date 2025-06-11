import { Suspense } from 'react';
import CourseListingPage from './course-listing-page';

interface SearchParams {
  search?: string;
  category?: string;
  instructor?: string;
  price?: string;
  sort?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default function CoursesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<></>}>
      <CourseListingPage searchParams={searchParams} />
    </Suspense>
  );
}
