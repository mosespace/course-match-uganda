'use client';

import CoursesCard from '@/components/courses/courses-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { siteConfig } from '@/constants/site';
import { useSuspenseCourses } from '@/hooks/tansatack/useCourses';
import {
  BookOpen,
  ChevronRight,
  Grid3X3,
  List,
  Search,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'; // Import useCallback

const categories = [
  { name: 'Business English', count: 2500 },
  { name: 'English Conversation', count: 1800 },
  { name: 'Electrical Engineering', count: 1200 },
  { name: 'Architecture Engineering', count: 950 },
  { name: 'Human Resources', count: 750 },
  { name: 'Quality Management', count: 680 },
  { name: 'Educational Psychology', count: 520 },
  { name: 'Digital Marketing', count: 1500 },
  { name: 'Project Management', count: 890 },
  { name: 'Supply Chain Management', count: 430 },
];

const descriptions = [
  { name: 'Steven Cooper', courses: 125 },
  { name: 'Alice Miller', courses: 98 },
  { name: 'Lewis Alexander', courses: 87 },
  { name: 'Guy Hawkins', courses: 76 },
  { name: 'Kristin Watson', courses: 65 },
  { name: 'Savannah Nguyen', courses: 54 },
  { name: 'Darrell Steward', courses: 43 },
  { name: 'Marvin McKinney', courses: 38 },
  { name: 'Courtney Robertson', courses: 32 },
  { name: 'Esther Howard', courses: 28 },
];

const yearRanges = [
  { label: '3 Year(s)', count: 500 },
  { label: '1 Year', count: 120 },
  { label: '2 Year(s)', count: 380 },
  { label: '4 Year(s)', count: 95 },
  { label: '5 Year(s)', count: 45 },
];

export default function CourseListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { courses } = useSuspenseCourses(); // This will suspend until data is ready

  // Use refs to store the current filter states without causing re-renders immediately
  // This helps in debouncing URL updates
  const searchTermRef = useRef('');
  const selectedCategoryRef = useRef('');
  const selectedDescriptionRef = useRef('');
  const selectedYearsRef = useRef('');
  const sortByRef = useRef('default');
  const viewModeRef = useRef('grid');
  const currentPageRef = useRef(1);

  // States that actually cause re-renders for UI updates
  const [searchTerm, _setSearchTerm] = useState('');
  const [selectedCategory, _setSelectedCategory] = useState('');
  const [selectedDescription, _setSelectedDescription] = useState('');
  const [selectedYears, _setSelectedYears] = useState('');
  const [sortBy, _setSortBy] = useState('default');
  const [viewMode, _setViewMode] = useState('grid');
  const [currentPage, _setCurrentPage] = useState(1);

  const coursesPerPage = 6;
  const initialRender = useRef(true); // Flag to prevent URL updates on the very first render

  // Use a single debounced function for URL updates
  const updateUrl = useCallback(() => {
    // Only update URL if the component has fully mounted and is not in its initial render cycle.
    // We prevent URL updates on the very first render because the state is being initialized from the URL.
    if (initialRender.current) return;

    const params = new URLSearchParams();

    // Use ref values for the URL parameters
    if (searchTermRef.current) params.set('search', searchTermRef.current);
    if (selectedCategoryRef.current) params.set('level', selectedCategoryRef.current);
    if (selectedDescriptionRef.current) params.set('description', selectedDescriptionRef.current);
    if (selectedYearsRef.current) params.set('year', selectedYearsRef.current);
    if (sortByRef.current !== 'default') params.set('sort', sortByRef.current);
    if (viewModeRef.current !== 'grid') params.set('view', viewModeRef.current);
    if (currentPageRef.current > 1) params.set('page', currentPageRef.current.toString());

    const newUrl = params.toString() ? `/courses?${params.toString()}` : '/courses';

    // Check if the current URL is different to avoid unnecessary navigations
    if (typeof window !== 'undefined' && window.location.search !== `?${params.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [router]);

  // Effect to initialize state from URL params on mount
  useEffect(() => {
    if (searchParams) {
      const initialSearchTerm = searchParams.get('search') || '';
      const initialCategory = searchParams.get('level') || '';
      const initialDescription = searchParams.get('description') || '';
      const initialYears = searchParams.get('year') || '';
      const initialSortBy = searchParams.get('sort') || 'default';
      const initialViewMode = searchParams.get('view') || 'grid';
      const initialPage = Number(searchParams.get('page')) || 1;

      _setSearchTerm(initialSearchTerm);
      _setSelectedCategory(initialCategory);
      _setSelectedDescription(initialDescription);
      _setSelectedYears(initialYears);
      _setSortBy(initialSortBy);
      _setViewMode(initialViewMode);
      _setCurrentPage(initialPage);

      // Also update refs immediately for the initial state
      searchTermRef.current = initialSearchTerm;
      selectedCategoryRef.current = initialCategory;
      selectedDescriptionRef.current = initialDescription;
      selectedYearsRef.current = initialYears;
      sortByRef.current = initialSortBy;
      viewModeRef.current = initialViewMode;
      currentPageRef.current = initialPage;
    }
    initialRender.current = false; // Mark initial render as complete after state initialization
  }, [searchParams]); // Depend only on searchParams

  // Effect to sync URL when filter/pagination states change (debounced)
  useEffect(() => {
    // Update refs with latest state values
    searchTermRef.current = searchTerm;
    selectedCategoryRef.current = selectedCategory;
    selectedDescriptionRef.current = selectedDescription;
    selectedYearsRef.current = selectedYears;
    sortByRef.current = sortBy;
    viewModeRef.current = viewMode;
    currentPageRef.current = currentPage;

    const handler = setTimeout(() => {
      updateUrl();
    }, 300); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [
    searchTerm,
    selectedCategory,
    selectedDescription,
    selectedYears,
    sortBy,
    viewMode,
    currentPage,
    updateUrl, // Add updateUrl to dependencies
  ]);

  // Helper functions to update state and trigger URL sync indirectly
  const setSearchTerm = (value) => {
    _setSearchTerm(value);
    _setCurrentPage(1); // Reset page on filter change
  };
  const setSelectedCategory = (value) => {
    _setSelectedCategory(value);
    _setCurrentPage(1);
  };
  const setSelectedDescription = (value) => {
    _setSelectedDescription(value);
    _setCurrentPage(1);
  };
  const setSelectedYears = (value) => {
    _setSelectedYears(value);
    _setCurrentPage(1);
  };
  const setSortBy = (value) => {
    _setSortBy(value);
    _setCurrentPage(1);
  };
  const setViewMode = (value) => {
    _setViewMode(value);
  };
  const setCurrentPage = (value) => {
    _setCurrentPage(value);
  };

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Ensure that `level` and `description` are correctly mapped if they are IDs or different strings
      // For categories, ensure `course.level` matches `selectedCategory.name` or `selectedCategory` itself
      const matchesLevel =
        !selectedCategory ||
        course.level === selectedCategory ||
        categories.find((cat) => cat.name === selectedCategory)?.name === course.level;

      // For descriptions, ensure `course.description` matches `selectedDescription.name` or `selectedDescription` itself
      const matchesDescription =
        !selectedDescription ||
        course.description === selectedDescription ||
        descriptions.find((desc) => desc.name === selectedDescription)?.name ===
          course.description;

      const matchesYears =
        !selectedYears ||
        (selectedYears === '1 Year' && course.duration === 1) ||
        (selectedYears === '2 Year(s)' && course.duration === 2) ||
        (selectedYears === '3 Year(s)' && course.duration === 3) ||
        (selectedYears === '4 Year(s)' && course.duration === 4) ||
        (selectedYears === '5 Year(s)' && course.duration === 5);

      return matchesSearch && matchesLevel && matchesDescription && matchesYears;
    });

    // Sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'year-low':
        filtered.sort((a, b) => Number(a.year) - Number(b.year));
        break;
      case 'year-high':
        filtered.sort((a, b) => Number(b.year) - Number(a.year));
        break;
      case 'students':
        filtered.sort((a, b) => Number(b.students) - Number(a.students));
        break;
    }

    return filtered;
  }, [
    courses,
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

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Search */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search
                </h3>
                <div className="relative">
                  <Input
                    placeholder="Search Courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Course Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((level) => (
                    <div
                      key={level.name}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === level.name
                          ? 'bg-orange-50 text-orange-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === level.name
                            ? ''
                            : level.name,
                        )
                      }
                    >
                      <span className="text-sm font-medium">
                        {level.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({level.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Descriptions
                </h3>
                <div className="space-y-2">
                  {descriptions.slice(0, 8).map((description) => (
                    <div
                      key={description.name}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedDescription === description.name
                          ? 'bg-orange-50 text-orange-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() =>
                        setSelectedDescription(
                          selectedDescription === description.name
                            ? ''
                            : description.name,
                        )
                      }
                    >
                      <span className="text-sm font-medium">
                        {description.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({description.courses})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Years With Courses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Years With Courses
                </h3>
                <div className="space-y-2">
                  {yearRanges.map((range) => (
                    <div
                      key={range.label}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedYears === range.label
                          ? 'bg-orange-50 text-orange-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() =>
                        setSelectedYears(
                          selectedYears === range.label ? '' : range.label,
                        )
                      }
                    >
                      <span className="text-sm font-medium">{range.label}</span>
                      <span className="text-xs text-gray-500">
                        ({range.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  We Found{' '}
                  <span className="text-orange-500">
                    {filteredCourses.length}
                  </span>{' '}
                  courses for you
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sort By:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="year-low">
                      Years: Low to High
                    </SelectItem>
                    <SelectItem value="year-high">
                      Years: High to Low
                    </SelectItem>
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

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {paginatedCourses.map((course) => (
                  <CoursesCard course={course} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                {paginatedCourses.map((course) => (
                  <CoursesCard course={course} view="list" />
                ))}
              </div>
            )}

            {/* Add pagination component at the bottom - replace the existing pagination comment */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border-gray-300"
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          pageNumber === currentPage ? 'default' : 'outline'
                        }
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

                  // Show ellipsis for skipped pages
                  if (
                    (pageNumber === currentPage - 2 && pageNumber > 2) ||
                    (pageNumber === currentPage + 2 &&
                      pageNumber < totalPages - 1)
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
              Showing {(currentPage - 1) * coursesPerPage + 1} to{' '}
              {Math.min(currentPage * coursesPerPage, filteredCourses.length)}{' '}
              of {filteredCourses.length} courses
            </div>

            <div className="w-full pt-4 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                {/* Student Feedback */}
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
                          combination and we'll suggest the best courses for you
                          from all Universities in Uganda.
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
          </div>
        </div>
      </div>
    </div>
  );
}
