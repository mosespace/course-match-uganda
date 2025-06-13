// @/components/courses/course-filter-sidebar.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { CourseLevel } from '@prisma/client';

interface CourseFilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedDescription: string;
  setSelectedDescription: (value: string) => void;
  selectedYears: string;
  setSelectedYears: (value: string) => void;
}

// Dummy data (can be moved to constants or fetched from API)
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
  { label: '3 Year(s)', value: 3, count: 500 },
  { label: '1 Year', value: 1, count: 120 },
  { label: '2 Year(s)', value: 2, count: 380 },
  { label: '4 Year(s)', value: 4, count: 95 },
  { label: '5 Year(s)', value: 5, count: 45 },
];

export default function CourseFilterSidebar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDescription,
  setSelectedDescription,
  selectedYears,
  setSelectedYears,
}: CourseFilterSidebarProps) {
  return (
    <aside className="w-full space-y-6 md:w-1/4">
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Search Course
          </h3>
          <div className="relative">
            <Input
              type="text"
              placeholder="Find Courses..."
              className="pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Course Categories
          </h3>
          <div className="space-y-3">
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
                    selectedCategory === category.name ? '' : category.name,
                  )
                }
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-xs text-gray-500">
                  ({category.count})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Instructors/Affiliations
          </h3>
          <div className="space-y-3">
            {descriptions.map((desc) => (
              <div
                key={desc.name}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedDescription === desc.name
                    ? 'bg-orange-50 text-orange-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() =>
                  setSelectedDescription(
                    selectedDescription === desc.name ? '' : desc.name,
                  )
                }
              >
                <span className="text-sm font-medium">{desc.name}</span>
                <span className="text-xs text-gray-500">({desc.courses})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Years of Study
          </h3>
          <div className="space-y-3">
            {yearRanges.map((year) => (
              <div
                key={year.label}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedYears === year.label
                    ? 'bg-orange-50 text-orange-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() =>
                  setSelectedYears(
                    selectedYears === year.label ? '' : year.label,
                  )
                }
              >
                <span className="text-sm font-medium">{year.label}</span>
                <span className="text-xs text-gray-500">({year.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
