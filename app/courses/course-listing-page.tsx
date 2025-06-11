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
import {
  BookOpen,
  ChevronRight,
  Grid3X3,
  List,
  Search,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const courses = [
  {
    id: 1,
    title: 'Career to build for the pro level',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.8,
    reviews: 156,
    price: '$49',
    originalPrice: '$99',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Business English',
    duration: '12 hours',
    lessons: 24,
    level: 'Beginner',
    description: 'Master professional communication skills',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Take A Course For Bright Future',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.9,
    reviews: 203,
    price: '$59',
    originalPrice: '$119',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Web Design',
    duration: '18 hours',
    lessons: 32,
    level: 'Intermediate',
    description: 'Learn modern web design principles',
    color: 'bg-purple-500',
  },
  {
    id: 3,
    title: 'Take A Course For Bright Future',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.7,
    reviews: 189,
    price: '$39',
    originalPrice: '$79',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Programming',
    duration: '15 hours',
    lessons: 28,
    level: 'Advanced',
    description: 'Advanced programming concepts',
    color: 'bg-green-500',
  },
  {
    id: 4,
    title: 'CSS - The Complete Guide 2020',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.8,
    reviews: 267,
    price: '$45',
    originalPrice: '$89',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Web Development',
    duration: '20 hours',
    lessons: 35,
    level: 'Beginner',
    description: 'Complete CSS mastery course',
    color: 'bg-orange-500',
  },
  {
    id: 5,
    title: 'Web Design For Beginners to Pro',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.6,
    reviews: 145,
    price: '$55',
    originalPrice: '$109',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Web Design',
    duration: '16 hours',
    lessons: 30,
    level: 'Beginner',
    description: 'From basics to professional web design',
    color: 'bg-blue-600',
  },
  {
    id: 6,
    title: 'Digitally Hosting Light And Color',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.9,
    reviews: 198,
    price: '$65',
    originalPrice: '$129',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Digital Art',
    duration: '14 hours',
    lessons: 26,
    level: 'Intermediate',
    description: 'Master digital lighting techniques',
    color: 'bg-pink-500',
  },
  {
    id: 7,
    title: 'Digitally Hosting Light And Color',
    instructor: 'Robert Fox',
    students: '50+ Students',
    rating: 4.9,
    reviews: 198,
    price: '$65',
    originalPrice: '$129',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Digital Art',
    duration: '14 hours',
    lessons: 26,
    level: 'Intermediate',
    description: 'Master digital lighting techniques',
    color: 'bg-pink-500',
  },
];

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

const instructors = [
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

const priceRanges = [
  { label: 'All Courses', count: 500 },
  { label: 'Free Courses', count: 120 },
  { label: 'Paid Courses', count: 380 },
  { label: 'Discounted Courses', count: 95 },
  { label: 'Premium Courses', count: 45 },
];

interface SearchParams {
  search?: string;
  category?: string;
  instructor?: string;
  price?: string;
  sort?: string;
  view?: string;
  page?: string;
}

interface CourseListingPageProps {
  searchParams: SearchParams;
}

export default function CourseListingPage({
  searchParams,
}: CourseListingPageProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.category || '',
  );
  const [selectedInstructor, setSelectedInstructor] = useState(
    searchParams.instructor || '',
  );
  const [selectedPrice, setSelectedPrice] = useState(searchParams.price || '');
  const [sortBy, setSortBy] = useState(searchParams.sort || 'default');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  // Add view state and pagination state to the component
  const [viewMode, setViewMode] = useState(searchParams.view || 'grid');
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.page) || 1,
  );
  const coursesPerPage = 6;

  // Update URL when filters change
  // Update the useEffect to include viewMode and currentPage in URL params
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedInstructor) params.set('instructor', selectedInstructor);
    if (selectedPrice) params.set('price', selectedPrice);
    if (sortBy !== 'default') params.set('sort', sortBy);
    if (viewMode !== 'grid') params.set('view', viewMode);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString()
      ? `/courses?${params.toString()}`
      : '/courses';
    router.replace(newUrl, { scroll: false });
  }, [
    searchTerm,
    selectedCategory,
    selectedInstructor,
    selectedPrice,
    sortBy,
    viewMode,
    currentPage,
    router,
  ]);

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || course.category === selectedCategory;

      const matchesInstructor =
        !selectedInstructor || course.instructor === selectedInstructor;

      const matchesPrice =
        !selectedPrice ||
        (selectedPrice === 'Free Courses' && course.price === 'Free') ||
        (selectedPrice === 'Paid Courses' && course.price !== 'Free') ||
        selectedPrice === 'All Courses';

      return (
        matchesSearch && matchesCategory && matchesInstructor && matchesPrice
      );
    });

    // Sort courses
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort(
          (a, b) =>
            Number.parseInt(a.price.replace('$', '')) -
            Number.parseInt(b.price.replace('$', '')),
        );
        break;
      case 'price-high':
        filtered.sort(
          (a, b) =>
            Number.parseInt(b.price.replace('$', '')) -
            Number.parseInt(a.price.replace('$', '')),
        );
        break;
      case 'students':
        filtered.sort(
          (a, b) =>
            Number.parseInt(b.students.replace(/\D/g, '')) -
            Number.parseInt(a.students.replace(/\D/g, '')),
        );
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedInstructor, selectedPrice, sortBy]);

  // Add pagination logic to the filteredCourses
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, currentPage, coursesPerPage]);

  // Add totalPages calculation
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedInstructor, selectedPrice, sortBy]);

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
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-orange-50 text-orange-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.name
                            ? ''
                            : category.name,
                        )
                      }
                    >
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({category.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructors */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Instructors
                </h3>
                <div className="space-y-2">
                  {instructors.slice(0, 8).map((instructor) => (
                    <div
                      key={instructor.name}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedInstructor === instructor.name
                          ? 'bg-orange-50 text-orange-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() =>
                        setSelectedInstructor(
                          selectedInstructor === instructor.name
                            ? ''
                            : instructor.name,
                        )
                      }
                    >
                      <span className="text-sm font-medium">
                        {instructor.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({instructor.courses})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price With Courses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price With Courses
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div
                      key={range.label}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPrice === range.label
                          ? 'bg-orange-50 text-orange-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() =>
                        setSelectedPrice(
                          selectedPrice === range.label ? '' : range.label,
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
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
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
