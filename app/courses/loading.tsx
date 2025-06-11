import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CourseListingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Skeleton */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded" />
              <div>
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Skeleton className="h-12 w-32 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-48 mx-auto mb-8 bg-white/20" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-16 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-20 mx-auto bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="flex-1 h-12 rounded-lg" />
            <div className="flex gap-3">
              <Skeleton className="w-48 h-12 rounded-lg" />
              <Skeleton className="w-24 h-12 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Course Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300"></div>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-3 rounded" />
                  <Skeleton className="h-6 w-full mb-1 rounded" />
                  <Skeleton className="h-5 w-3/4 mb-3 rounded" />
                  <Skeleton className="h-4 w-full mb-2 rounded" />
                  <Skeleton className="h-4 w-2/3 mb-4 rounded" />
                  <div className="flex gap-1 mb-4">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-5 w-14 rounded" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
