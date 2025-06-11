"use client"

import { useState } from "react"
import {
  Search,
  BookOpen,
  Beaker,
  Utensils,
  Heart,
  BarChart3,
  Palette,
  Church,
  ChevronRight,
  Clock,
  Users,
  Star,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const courses = [
  {
    id: 1,
    title: "Divinity",
    degree: "Bachelor of",
    duration: "3 years",
    category: "Theology",
    icon: Church,
    color: "bg-purple-500",
    students: "2,340",
    rating: 4.8,
    description: "Explore theological studies and spiritual leadership",
  },
  {
    id: 2,
    title: "Agricultural Science & Entrepreneurship",
    degree: "Bachelor of",
    duration: "4 years",
    category: "Agriculture",
    icon: Beaker,
    color: "bg-green-500",
    students: "1,890",
    rating: 4.6,
    description: "Combine agricultural innovation with business acumen",
  },
  {
    id: 3,
    title: "Food Science & Technology",
    degree: "Bachelor of Science in",
    duration: "4 years",
    category: "Science",
    icon: Utensils,
    color: "bg-orange-500",
    students: "1,567",
    rating: 4.7,
    description: "Master food production, safety, and innovation",
  },
  {
    id: 4,
    title: "Human Nutrition & Clinical Dietetics",
    degree: "Bachelor of Science in",
    duration: "3 years",
    category: "Health",
    icon: Heart,
    color: "bg-red-500",
    students: "2,123",
    rating: 4.9,
    description: "Promote health through nutrition science",
  },
  {
    id: 5,
    title: "Data Science And Analytics",
    degree: "Bachelor of Science in",
    duration: "4 years",
    category: "Technology",
    icon: BarChart3,
    color: "bg-blue-500",
    students: "3,456",
    rating: 4.8,
    description: "Transform data into actionable insights",
  },
  {
    id: 6,
    title: "Visual Arts And Design",
    degree: "Bachelor of",
    duration: "3 years",
    category: "Arts",
    icon: Palette,
    color: "bg-pink-500",
    students: "1,234",
    rating: 4.5,
    description: "Express creativity through visual mediums",
  },
]

export default function CourseListingDesign() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || course.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesDuration = selectedDuration === "all" || course.duration === selectedDuration

    return matchesSearch && matchesCategory && matchesDuration
  })

  const categories = ["all", ...Array.from(new Set(courses.map((course) => course.category)))]
  const durations = ["all", ...Array.from(new Set(courses.map((course) => course.duration)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                <p className="text-sm text-gray-500">Discover your perfect program</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {filteredCourses.length} courses
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">1,043</h2>
            <p className="text-xl opacity-90">Total Courses Available</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-80">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25,000+</div>
                <div className="text-sm opacity-80">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.7★</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, categories, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration === "all" ? "All Durations" : duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCourses.map((course) => {
            const IconComponent = course.icon
            return (
              <Card
                key={course.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`${course.color} p-3 rounded-xl text-white mb-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      {course.category}
                    </Badge>
                    <h3 className="font-bold text-lg leading-tight mb-1">{course.degree}</h3>
                    <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">Can't find a course?</h3>
                <p className="text-amber-800 text-sm mb-4">
                  Let's help you find it. Just give us your A-level combination and we'll suggest the best courses for
                  you from all Universities in Uganda.
                </p>
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Get Course Recommendations
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
