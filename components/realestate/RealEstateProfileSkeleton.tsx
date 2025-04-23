import { Skeleton } from "@/components/ui/skeleton"

export function RealEstateProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Profile Card Skeleton */}
        <div className="md:w-1/3 space-y-4">
          <div className="shadow-sm rounded-sm border p-6">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="w-full space-y-2 text-center">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-center gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content Skeleton */}
        <div className="md:w-2/3 space-y-6">
          {/* Verification Status Skeleton */}
          <div className="border rounded-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <div>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>

          {/* Location Map Skeleton */}
          <div className="border rounded-sm p-6">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}