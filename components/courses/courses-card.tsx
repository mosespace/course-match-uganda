import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Play, Star, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export type ICourse = {
  id: number;
  title: string;
  instructor: string;
  students: string;
  rating: number;
  reviews: number;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  duration: string;
  lessons: number;
  level: string;
  description: string;
  color: string;
};
export default function CoursesCard({
  view,
  course,
  className,
}: {
  view?: string;
  course: ICourse;
  className?: string;
}) {
  const [selectedCourse, setSelectedCourse] = useState(course);
  return (
    <>
      {view === 'grid' && (
        <Card
          key={course.id}
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
          onClick={() => setSelectedCourse(course)}
        >
          <div className="relative">
            <div
              className={`h-48 ${course.color} flex items-center justify-center`}
            >
              <div className="text-white text-6xl font-bold opacity-20">
                {course.category.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-white text-gray-700 hover:bg-white">
                {course.level}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4">
              <Button
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <Play className="h-4 w-4 mr-1" />
                03 Years
              </Button>
            </div>
          </div>

          <CardContent className="p-6">
            {/* <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {course.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {course.duration}
              </Badge>
            </div> */}

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>

            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs">
                  {course.instructor
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{course.instructor}</span>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({course.reviews})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm">{course.students}</span>
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
          onClick={() => setSelectedCourse(course)}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 flex-shrink-0">
              <div
                className={`h-48 md:h-full ${course.color} flex items-center justify-center`}
              >
                <div className="text-white text-6xl font-bold opacity-20">
                  {course.category.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-white text-gray-700 hover:bg-white">
                  {course.level}
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
                  {course.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {course.duration}
                </Badge>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 text-xl">
                {course.title}
              </h3>

              <p className="text-gray-600 mb-3 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center space-x-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">
                    {course.instructor
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  {course.instructor}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(course.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({course.reviews})
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{course.students}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <span className="text-sm">{course.lessons} lessons</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    {course.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {course.originalPrice}
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
    </>
  );
}
