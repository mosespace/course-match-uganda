'use client';

import { Play, Star, Users } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

import { Course as PrismaCourse, University } from '@prisma/client';

// Extend the PrismaCourse type to include related data and UI-specific properties
export type ICourseCardData = PrismaCourse & {
  // Add relations that are included in your API response
  university: University;
  requiredSubjects: { name: string }[]; // Assuming you fetch subjects with just their names
  // Add mock/derived properties for UI display that aren't directly in Prisma Course model
  instructor?: string; // Derived from university or a dedicated instructor field later
  studentsCount?: number; // Mocked or derived from actual student enrollments
  averageRating?: number; // Mocked or derived from reviews
  totalReviews?: number; // Mocked or derived from reviews
  price?: string; // Mocked
  originalPrice?: string; // Mocked
  lessonsCount?: number; // Mocked
  displayColor?: string; // Derived for UI
};

// Helper function to generate a consistent color for the card based on course ID/name
const generateColor = (id: string): string => {
  const colors = [
    'bg-blue-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-yellow-200',
    'bg-red-200',
    'bg-indigo-200',
    'bg-pink-200',
    'bg-teal-200',
  ];
  // Simple hash function to get a consistent color
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function CoursesCard({
  view,
  course, // Now of type ICourseCardData
  className,
}: {
  view?: string;
  course: ICourseCardData;
  className?: string;
}) {
  // const [selectedCourse, setSelectedCourse] = useState<ICourseCardData | null>(
  //   null,
  // );

  // Derive display values for the card
  const displayInstructor = course.university?.name || 'N/A'; // Use university name as instructor
  const displayStudents =
    course.studentsCount || Math.floor(Math.random() * 500) + 50 + ' Students'; // Mock students
  const displayRating =
    course.averageRating || (Math.random() * (5 - 3) + 3).toFixed(1); // Mock rating between 3.0 and 5.0
  const displayReviews =
    course.totalReviews || Math.floor(Math.random() * 200) + 10; // Mock reviews
  const displayPrice = course.price || '$49.99'; // Mock price
  const displayOriginalPrice = course.originalPrice || '$99.99'; // Mock original price
  const displayCategory =
    course.requiredSubjects[0]?.name ||
    course.level?.replace('_', ' ') ||
    'General'; // Use first subject name or level
  const displayLessons =
    course.lessonsCount || Math.floor(Math.random() * 50) + 10; // Mock lessons
  const cardColor = course.displayColor || generateColor(course.id); // Generate color

  return (
    <div>
      {view === 'grid' && (
        <Card
          key={course.id}
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
          // onClick={() => setSelectedCourse(course)}
        >
          <div className="relative">
            <div
              className={`h-48 ${cardColor} flex items-center justify-center`}
            >
              <div className="text-white text-6xl font-bold opacity-20">
                {displayCategory.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-white text-gray-700 hover:bg-white">
                {course.level?.replace('_', ' ')}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Button
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <Play className="h-4 w-4 mr-1" />
                {course.duration
                  ? `${course.duration} Year${course.duration > 1 ? 's' : ''}`
                  : 'N/A'}
              </Button>
            </div>
          </div>

          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.name} {/* Use course.name for title */}
            </h3>

            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs">
                  {displayInstructor
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{displayInstructor}</span>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(Number(displayRating))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({displayReviews})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">{displayStudents}</span>
              </div>
            </div>

            <Button size="sm" className="bg-primary w-full hover:bg-primary/80">
              Read More
            </Button>
          </CardContent>
        </Card>
      )}

      {view === 'list' && (
        <Card
          key={course.id}
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
          // onClick={() => setSelectedCourse(course)}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 flex-shrink-0">
              <div
                className={`h-48 md:h-full ${cardColor} flex items-center justify-center`}
              >
                <div className="text-white text-6xl font-bold opacity-20">
                  {displayCategory.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-white text-gray-700 hover:bg-white">
                  {course.level?.replace('_', ' ')}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <Button
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>

            <CardContent className="p-6 flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {displayCategory}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {course.duration
                    ? `${course.duration} Year${course.duration > 1 ? 's' : ''}`
                    : 'N/A'}
                </Badge>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 text-xl">
                {course.name} {/* Use course.name for title */}
              </h3>

              <p className="text-gray-600 mb-3 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center space-x-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">
                    {displayInstructor
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {displayInstructor}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(Number(displayRating))
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({displayReviews})
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{displayStudents}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <span className="text-sm">{displayLessons} lessons</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    {displayPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {displayOriginalPrice}
                  </span>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
}
