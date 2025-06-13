'use client';

import CourseFilterSidebar from '@/components/courses/course-filter-sidebar';
import CourseResultsSection from '@/components/courses/course-results-section';
import { siteConfig } from '@/constants/site';
import { useSuspenseCourses } from '@/hooks/tansatack/useCourses';
import { useUrlSync } from '@/hooks/use-url-sync'; // Import the new hook
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CourseLevel } from '@prisma/client'; // Assuming you still need this for internal filtering logic

// Dummy data (moved here to centralize if not fetched or for direct use in logic)
// Make sure this is consistent with CourseFilterSidebar dummy data or fetched data
const categories = [
  { name: 'Business English', count: 2500, level: CourseLevel.BACHELORS },
  { name: 'English Conversation', count: 1800, level: CourseLevel.DIPLOMA },
  { name: 'Electrical Engineering', count: 1200, level: CourseLevel.BACHELORS },
  { name: 'Architecture Engineering', count: 950, level: CourseLevel.MASTERS },
  { name: 'Human Resources', count: 750, level: CourseLevel.CERTIFICATE },
  { name: 'Quality Management', count: 680, level: CourseLevel.DIPLOMA },
  { name: 'Educational Psychology', count: 520, level: CourseLevel.PHD },
  { name: 'Digital Marketing', count: 1500, level: CourseLevel.BACHELORS },
  { name: 'Project Management', count: 890, level: CourseLevel.MASTERS },
  {
    name: 'Supply Chain Management',
    count: 430,
    level: CourseLevel.CERTIFICATE,
  },
];

const yearRanges = [
  { label: '3 Year(s)', value: 3, count: 500 },
  { label: '1 Year', value: 1, count: 120 },
  { label: '2 Year(s)', value: 2, count: 380 },
  { label: '4 Year(s)', value: 4, count: 95 },
  { label: '5 Year(s)', value: 5, count: 45 },
];

export default function CourseListingPage() {
  const { courses: fetchedCoursesData } = useSuspenseCourses();
  const allCourses = fetchedCoursesData || [];

  // State for all filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedYears, setSelectedYears] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 6;

  // Use useEffect to initialize state from URL params only once on mount
  // This effect will run on the client side during hydration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchTerm(params.get('search') || '');
    setSelectedCategory(params.get('level') || '');
    setSelectedDescription(params.get('description') || '');
    setSelectedYears(params.get('year') || '');
    setSortBy(params.get('sort') || 'default');
    setViewMode(params.get('view') || 'grid');
    setCurrentPage(Number(params.get('page')) || 1);
  }, []); // Empty dependency array: runs only once after initial render/hydration

  // Use the custom hook to sync state with URL
  useUrlSync(
    {
      search: searchTerm,
      level: selectedCategory,
      description: selectedDescription,
      year: selectedYears,
      sort: sortBy,
      view: viewMode,
      page: currentPage,
    },
    500, // Debounce delay
  );

  // Memoized filtering and sorting logic
  const filteredCourses = useMemo(() => {
    let filtered = allCourses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level
          ?.toLowerCase()
          .replace('_', ' ')
          .includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.university?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const selectedCategoryLevel = categories.find(
        (cat) => cat.name === selectedCategory,
      )?.level;
      const matchesLevel =
        !selectedCategory ||
        (selectedCategoryLevel && course.level === selectedCategoryLevel);

      const matchesDescription =
        !selectedDescription ||
        course.university?.name
          .toLowerCase()
          .includes(selectedDescription.toLowerCase());

      const selectedYearsValue = yearRanges.find(
        (range) => range.label === selectedYears,
      )?.value;
      const matchesYears =
        !selectedYears ||
        (selectedYearsValue && course.duration === selectedYearsValue);

      return (
        matchesSearch && matchesLevel && matchesDescription && matchesYears
      );
    });

    switch (sortBy) {
      case 'rating':
        filtered.sort(
          (a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0),
        );
        break;
      case 'year-low':
        filtered.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'year-high':
        filtered.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
      case 'students':
        filtered.sort(
          (a, b) => Number(b.studentsCount || 0) - Number(a.studentsCount || 0),
        );
        break;
      case 'default':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return filtered;
  }, [
    allCourses,
    searchTerm,
    selectedCategory,
    selectedDescription,
    selectedYears,
    sortBy,
  ]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  }, [filteredCourses, currentPage]);

  const totalFilteredCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalFilteredCourses / coursesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {siteConfig.name} COURSES
            </h1>
            <div className="text-sm text-gray-500">
              <span>Home</span> <span className="mx-2">&gt;</span>{' '}
              <span>{siteConfig.name} all Courses</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar for Filters */}
          <CourseFilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDescription={selectedDescription}
            setSelectedDescription={setSelectedDescription}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
          />

          {/* Right Content Area for Courses */}
          <CourseResultsSection
            paginatedCourses={paginatedCourses}
            filteredCoursesCount={totalFilteredCourses}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            coursesPerPage={coursesPerPage}
          />
        </div>
      </div>
    </div>
  );
}
