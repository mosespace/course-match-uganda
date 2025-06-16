// @/components/courses/course-results-section.tsx
'use client';

import CoursesCard, {
  ICourseCardData,
} from '@/components/courses/courses-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Grid3X3, List } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { BookOpen, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

interface CourseResultsSectionProps {
  paginatedCourses: ICourseCardData[];
  filteredCoursesCount: number;
  sortBy: string;
  setSortBy: (value: string) => void;
  viewMode: string;
  setViewMode: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number | ((prev: number) => number)) => void;
  totalPages: number;
  coursesPerPage: number;
}

export default function CourseResultsSection({
  paginatedCourses,
  filteredCoursesCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  currentPage,
  setCurrentPage,
  totalPages,
  coursesPerPage,
}: CourseResultsSectionProps) {
  const startCourseIndex = (currentPage - 1) * coursesPerPage + 1;
  const endCourseIndex = Math.min(
    currentPage * coursesPerPage,
    filteredCoursesCount,
  );

  return (
    <section className="w-full md:w-3/4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          We Found{' '}
          <span className="text-orange-500">{filteredCoursesCount}</span>{' '}
          courses for you
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort By:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="year-low">Years: Low to High</SelectItem>
              <SelectItem value="year-high">Years: High to Low</SelectItem>
              <SelectItem value="students">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={
                viewMode === 'grid'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              }
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={
                viewMode === 'list'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {paginatedCourses.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No courses found matching your criteria.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {paginatedCourses.map((course) => (
            <CoursesCard key={course.id} course={course} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {paginatedCourses.map((course) => (
            <CoursesCard key={course.id} course={course} view="list" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-gray-300"
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={
                    pageNumber === currentPage
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'border-gray-300'
                  }
                >
                  {pageNumber}
                </Button>
              );
            }
            if (
              (pageNumber === currentPage - 2 && pageNumber > 2) ||
              (pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
            ) {
              return (
                <span key={pageNumber} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev: any) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="border-gray-300"
          >
            Next
          </Button>
        </div>
      )}

      {/* Show pagination info */}
      <div className="text-center text-sm text-gray-600 mt-4">
        Showing {startCourseIndex} to {endCourseIndex} of {filteredCoursesCount}{' '}
        courses
      </div>

      {/* Student Feedback & Course Recommendations */}
      <div className="w-full pt-4 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Student Feedback
            </h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">3.9</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">Course Ratings</div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <Progress
                    value={stars === 5 ? 70 : stars === 4 ? 20 : 5}
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-gray-600 w-8">
                    {stars === 5 ? '70%' : stars === 4 ? '20%' : '5%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Can't find a course?
                  </h3>
                  <p className="text-amber-800 text-sm mb-4">
                    Let's help you find it. Just give us your A-level
                    combination and we'll suggest the best courses for you from
                    all Universities in Uganda.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    <Link href="/start">
                      Get Course Recommendations
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
